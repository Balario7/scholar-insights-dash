
export interface Student {
  id: string;
  gender: 'male' | 'female';
  parentalEducation: 
    'some high school' | 
    'high school' | 
    'some college' | 
    'associate\'s degree' | 
    'bachelor\'s degree' | 
    'master\'s degree';
  testPrep: 'none' | 'completed';
  mathScore: number;
  readingScore: number;
  writingScore: number;
}
