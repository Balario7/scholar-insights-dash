
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import DashboardHeader from '@/components/DashboardHeader';
import BoxPlot from '@/components/charts/BoxPlot';
import GenderBarChart from '@/components/charts/GenderBarChart';
import CorrelationHeatmap from '@/components/charts/CorrelationHeatmap';
import { fetchStudentData } from '@/lib/data';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [educationFilter, setEducationFilter] = useState<string>("all");
  
  const { data: studentData, isLoading, error } = useQuery({
    queryKey: ['studentData'],
    queryFn: fetchStudentData
  });

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-[90%] max-w-2xl">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error loading the student performance data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter data based on education level if not "all"
  const filteredData = educationFilter === "all" 
    ? studentData 
    : studentData.filter((student) => student.parentalEducation === educationFilter);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <main className="container px-4 py-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Performance Dashboard</h1>
            <p className="text-muted-foreground">Analyze performance metrics across demographics</p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <Select value={educationFilter} onValueChange={setEducationFilter}>
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder="Filter by parental education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Education Levels</SelectItem>
                <SelectItem value="some high school">Some High School</SelectItem>
                <SelectItem value="high school">High School</SelectItem>
                <SelectItem value="some college">Some College</SelectItem>
                <SelectItem value="associate's degree">Associate's Degree</SelectItem>
                <SelectItem value="bachelor's degree">Bachelor's Degree</SelectItem>
                <SelectItem value="master's degree">Master's Degree</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <StatCard 
            title="Math" 
            value={calculateAverage(filteredData, 'mathScore').toFixed(1)} 
            description="Avg. Score" 
            trend={determineScoreTrend(filteredData, 'mathScore')}
          />
          <StatCard 
            title="Reading" 
            value={calculateAverage(filteredData, 'readingScore').toFixed(1)} 
            description="Avg. Score" 
            trend={determineScoreTrend(filteredData, 'readingScore')}
          />
          <StatCard 
            title="Writing" 
            value={calculateAverage(filteredData, 'writingScore').toFixed(1)} 
            description="Avg. Score" 
            trend={determineScoreTrend(filteredData, 'writingScore')}
          />
        </div>

        <Tabs defaultValue="boxplot" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 h-auto">
            <TabsTrigger value="boxplot">Education Levels</TabsTrigger>
            <TabsTrigger value="gender">Gender Comparison</TabsTrigger>
            <TabsTrigger value="correlation">Score Correlation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="boxplot" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution by Parental Education</CardTitle>
                <CardDescription>Box plots showing score distribution across different parental education levels</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <BoxPlot data={filteredData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gender" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Scores by Gender</CardTitle>
                <CardDescription>Comparing performance between male and female students</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <GenderBarChart data={filteredData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="correlation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Score Correlation Heatmap</CardTitle>
                <CardDescription>Visualizing relationships between math, reading, and writing scores</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <CorrelationHeatmap data={filteredData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Demographics</CardTitle>
              <CardDescription>Key information about the student dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="px-3 py-1">
                  {filteredData.length} Students
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {new Set(filteredData.map(s => s.parentalEducation)).size} Education Levels
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Male: {filteredData.filter(s => s.gender === 'male').length}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Female: {filteredData.filter(s => s.gender === 'female').length}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  With Test Prep: {filteredData.filter(s => s.testPrep === 'completed').length}
                </Badge>
              </div>
              
              <Separator className="my-4" />
              
              <p className="text-sm text-muted-foreground">
                This dashboard visualizes student performance metrics based on the "Students Performance in Exams" dataset.
                Use the filter above to focus on specific parental education levels or view trends across all students.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
}

const StatCard = ({ title, value, description, trend }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend === 'up' && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-green-500">
            <path d="m17 7-7 7-4-4" />
          </svg>
        )}
        {trend === 'down' && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-500">
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-16 bg-white shadow-sm flex items-center px-4">
        <Skeleton className="h-8 w-[200px]" />
      </div>
      
      <main className="container px-4 py-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <Skeleton className="h-10 w-[300px] mb-2" />
          <Skeleton className="h-10 w-[240px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[80px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Utility functions
const calculateAverage = (data: any[], key: string) => {
  if (!data.length) return 0;
  return data.reduce((sum, student) => sum + student[key], 0) / data.length;
};

const determineScoreTrend = (data: any[], key: string): 'up' | 'down' | 'neutral' => {
  // This is a simplified placeholder - in a real app this would compare to previous periods
  const avg = calculateAverage(data, key);
  if (avg > 70) return 'up';
  if (avg < 50) return 'down';
  return 'neutral';
};

export default Index;
