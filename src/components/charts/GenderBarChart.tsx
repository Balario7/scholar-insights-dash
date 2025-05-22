
import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Student } from '@/types/student';

interface GenderBarChartProps {
  data: Student[];
}

const GenderBarChart: React.FC<GenderBarChartProps> = ({ data }) => {
  // Calculate average scores by gender
  const maleStudents = data.filter(student => student.gender === 'male');
  const femaleStudents = data.filter(student => student.gender === 'female');
  
  const calculateAverage = (students: Student[], scoreType: keyof Student) => {
    if (!students.length) return 0;
    return students.reduce((sum, student) => sum + (student[scoreType] as number), 0) / students.length;
  };
  
  const chartData = [
    {
      subject: "Math",
      Male: parseFloat(calculateAverage(maleStudents, 'mathScore').toFixed(1)),
      Female: parseFloat(calculateAverage(femaleStudents, 'mathScore').toFixed(1)),
    },
    {
      subject: "Reading",
      Male: parseFloat(calculateAverage(maleStudents, 'readingScore').toFixed(1)),
      Female: parseFloat(calculateAverage(femaleStudents, 'readingScore').toFixed(1)),
    },
    {
      subject: "Writing",
      Male: parseFloat(calculateAverage(maleStudents, 'writingScore').toFixed(1)),
      Female: parseFloat(calculateAverage(femaleStudents, 'writingScore').toFixed(1)),
    },
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis domain={[0, 100]} label={{ value: 'Average Score', angle: -90, position: 'insideLeft' }} />
        <Tooltip 
          formatter={(value) => [`${value}`, 'Average Score']}
          labelFormatter={(label) => `${label} Subject`}
        />
        <Legend />
        <Bar dataKey="Male" fill="#3b82f6" name="Male" />
        <Bar dataKey="Female" fill="#ec4899" name="Female" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GenderBarChart;
