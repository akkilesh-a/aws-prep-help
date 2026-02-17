import path from "path";
import { promises as fs } from "fs";

// Minimum quiz length - ensures consistent quiz sizes
export const MIN_QUIZ_LENGTH = 65;

// Get the length of a quiz
export const getCertificationQuizDetails = async (
  certification: string,
  quiz: string
) => {
  const certificationFolder = path.join(
    process.cwd(),
    `src/data/${certification}`
  );
  
  // Compute total available questions across all quiz files
  const allFiles = await fs.readdir(certificationFolder);
  const quizFiles = allFiles.filter(
    (file) => file.endsWith(".json") && file !== "config.json"
  );
  
  let totalAvailableQuestions = 0;
  for (const quizFilename of quizFiles) {
    const filePath = path.join(certificationFolder, quizFilename);
    const fileData = await fs.readFile(filePath, "utf-8");
    const questions = JSON.parse(fileData);
    totalAvailableQuestions += questions.length;
  }
  
  // Return the smaller of MIN_QUIZ_LENGTH and total available questions
  return Math.min(MIN_QUIZ_LENGTH, totalAvailableQuestions);
};
