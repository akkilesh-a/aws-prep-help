export type Explanation = {
  whyCorrect: string;
  whyOthersWrong: string;
  additionalPoints: string;
  bestPractices: string;
};

export type Question = {
  question: string;
  options: string[];
  correctAnswer: string | string[];
  explanation?: Explanation;
};

export type Quiz = Question[];
