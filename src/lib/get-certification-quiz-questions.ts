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
  return quizData;
};
