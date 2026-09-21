export type Question = {
  question: string;
  options: string[];
  answer: number;
};

export type SampleTest = {
  id: string;
  title: string;
  category: string;
  topic: string;
  schoolLevel: string;
  description: string;
  level: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
};
