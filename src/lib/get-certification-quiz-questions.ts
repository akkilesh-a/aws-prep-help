import { promises as fs } from "fs";
import path from "path";

export const getCertificationQuizQuestions = async (
  certification: string,
  quiz: string
) => {
  const quizFile = path.join(
    process.cwd(),
    `src/data/${certification}`,
    `${quiz}.json`
  );
  const quizDataRaw = await fs.readFile(quizFile, "utf-8");
  const quizData = JSON.parse(quizDataRaw);
  
  // Shuffle the array using Fisher-Yates algorithm
  for (let i = quizData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
  }
  
  return quizData;
};
