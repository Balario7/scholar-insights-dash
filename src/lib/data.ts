
import { Student } from '@/types/student';

// Mock data for the "Students Performance in Exams" dataset
export const fetchStudentData = async (): Promise<Student[]> => {
  // In a real-world scenario, this would fetch from an API or GCP bucket
  // For demo purposes, we'll use mock data
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: "1",
      gender: "female",
      parentalEducation: "bachelor's degree",
      testPrep: "completed",
      mathScore: 72,
      readingScore: 85,
      writingScore: 83
    },
    {
      id: "2",
      gender: "female",
      parentalEducation: "some college",
      testPrep: "none",
      mathScore: 69,
      readingScore: 90,
      writingScore: 88
    },
    {
      id: "3",
      gender: "female",
      parentalEducation: "master's degree",
      testPrep: "completed",
      mathScore: 90,
      readingScore: 95,
      writingScore: 93
    },
    {
      id: "4",
      gender: "male",
      parentalEducation: "associate's degree",
      testPrep: "none",
      mathScore: 76,
      readingScore: 78,
      writingScore: 75
    },
    {
      id: "5",
      gender: "male",
      parentalEducation: "some high school",
      testPrep: "none",
      mathScore: 65,
      readingScore: 58,
      writingScore: 52
    },
    {
      id: "6",
      gender: "male",
      parentalEducation: "high school",
      testPrep: "completed",
      mathScore: 78,
      readingScore: 72,
      writingScore: 70
    },
    {
      id: "7",
      gender: "female",
      parentalEducation: "some college",
      testPrep: "completed",
      mathScore: 85,
      readingScore: 92,
      writingScore: 87
    },
    {
      id: "8",
      gender: "male",
      parentalEducation: "some high school",
      testPrep: "none",
      mathScore: 60,
      readingScore: 50,
      writingScore: 52
    },
    {
      id: "9",
      gender: "male",
      parentalEducation: "high school",
      testPrep: "none",
      mathScore: 68,
      readingScore: 64,
      writingScore: 60
    },
    {
      id: "10",
      gender: "female",
      parentalEducation: "bachelor's degree",
      testPrep: "completed",
      mathScore: 83,
      readingScore: 90,
      writingScore: 93
    },
    {
      id: "11",
      gender: "female",
      parentalEducation: "associate's degree",
      testPrep: "completed",
      mathScore: 76,
      readingScore: 87,
      writingScore: 85
    },
    {
      id: "12",
      gender: "male",
      parentalEducation: "bachelor's degree",
      testPrep: "none",
      mathScore: 80,
      readingScore: 75,
      writingScore: 72
    },
    {
      id: "13",
      gender: "male",
      parentalEducation: "master's degree",
      testPrep: "completed",
      mathScore: 95,
      readingScore: 88,
      writingScore: 92
    },
    {
      id: "14",
      gender: "female",
      parentalEducation: "high school",
      testPrep: "none",
      mathScore: 62,
      readingScore: 75,
      writingScore: 78
    },
    {
      id: "15",
      gender: "male",
      parentalEducation: "some college",
      testPrep: "completed",
      mathScore: 75,
      readingScore: 70,
      writingScore: 68
    },
    {
      id: "16",
      gender: "female",
      parentalEducation: "some high school",
      testPrep: "completed",
      mathScore: 70,
      readingScore: 65,
      writingScore: 68
    },
    {
      id: "17",
      gender: "male",
      parentalEducation: "associate's degree",
      testPrep: "none",
      mathScore: 72,
      readingScore: 67,
      writingScore: 65
    },
    {
      id: "18",
      gender: "female",
      parentalEducation: "master's degree",
      testPrep: "none",
      mathScore: 85,
      readingScore: 88,
      writingScore: 90
    },
    {
      id: "19",
      gender: "female",
      parentalEducation: "high school",
      testPrep: "completed",
      mathScore: 78,
      readingScore: 82,
      writingScore: 85
    },
    {
      id: "20",
      gender: "male",
      parentalEducation: "bachelor's degree",
      testPrep: "completed",
      mathScore: 88,
      readingScore: 83,
      writingScore: 85
    },
    {
      id: "21",
      gender: "female",
      parentalEducation: "some college",
      testPrep: "none",
      mathScore: 72,
      readingScore: 80,
      writingScore: 82
    },
    {
      id: "22",
      gender: "male",
      parentalEducation: "some high school",
      testPrep: "completed",
      mathScore: 68,
      readingScore: 60,
      writingScore: 58
    },
    {
      id: "23",
      gender: "female",
      parentalEducation: "associate's degree",
      testPrep: "none",
      mathScore: 70,
      readingScore: 79,
      writingScore: 80
    },
    {
      id: "24",
      gender: "male",
      parentalEducation: "master's degree",
      testPrep: "completed",
      mathScore: 92,
      readingScore: 86,
      writingScore: 89
    }
  ];
};

// Calculate correlation between two arrays
export function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate numerator and denominators
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }
  
  // Calculate correlation
  const correlation = numerator / Math.sqrt(xDenominator * yDenominator);
  return parseFloat(correlation.toFixed(2));
}
