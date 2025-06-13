export type Question = {
  question: string;
  options: string[];
  correctAnswer: string | string[];
};

export type Quiz = Question[];
