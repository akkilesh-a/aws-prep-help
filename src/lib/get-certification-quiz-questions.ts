import { promises as fs } from "fs";
import path from "path";
import { MIN_QUIZ_LENGTH } from "./get-certification-quiz-details";
import { Question } from "@/types/quiz";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  // Shuffle the array 
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getCertificationQuizQuestions = async (
  certification: string,
  quiz: string
) => {
  const certificationFolder = path.join(
    process.cwd(),
    `src/data/${certification}`
  );
  
  const quizFile = path.join(certificationFolder, `${quiz}.json`);
  const quizDataRaw = await fs.readFile(quizFile, "utf-8");
  let quizData = JSON.parse(quizDataRaw);
  
  // Check if we have MIN_QUIZ_LENGTH questions
  if (quizData.length < MIN_QUIZ_LENGTH) {
    const requiredQuestions = MIN_QUIZ_LENGTH - quizData.length;
    
    // Get all available quiz files for this certification
    const allFiles = await fs.readdir(certificationFolder);
    const quizFiles = allFiles.filter(
      (file) => file.endsWith(".json") && file !== `${quiz}.json` && file !== "config.json"
    );
    
    // Load all questions from other quizzes
    const otherQuestions: Question[] = [];
    for (const quizFilename of quizFiles) {
      const filePath = path.join(certificationFolder, quizFilename);
      const fileData = await fs.readFile(filePath, "utf-8");
      const questions = JSON.parse(fileData) as Question[];
      otherQuestions.push(...questions);
    }
    
    // Create a Set of unique identifiers from quizData for deduplication
    const quizDataIds = new Set<string>();
    quizData.forEach((q: Question) => {
      const key = (q as any).id || q.question.toLowerCase().trim();
      quizDataIds.add(key);
    });
    
    // Deduplicate otherQuestions against quizData and within themselves
    const seenOtherKeys = new Set<string>();
    const uniqueOtherQuestions = otherQuestions.filter((q: Question) => {
      const key = (q as any).id || q.question.toLowerCase().trim();
      // Skip if already in quizData or already seen in otherQuestions
      if (quizDataIds.has(key) || seenOtherKeys.has(key)) {
        return false;
      }
      // Track this key and keep the question
      seenOtherKeys.add(key);
      return true;
    });
    
    // Randomly pick questions from other quizzes
    const shuffledOtherQuestions = shuffleArray(uniqueOtherQuestions);
    const additionalQuestions = shuffledOtherQuestions.slice(0, requiredQuestions);
    
    // Check if we have enough unique questions
    if (additionalQuestions.length < requiredQuestions) {
      const totalAvailable = quizData.length + uniqueOtherQuestions.length;
      console.warn(
        `Insufficient unique questions for quiz "${quiz}" in certification "${certification}". ` +
        `Expected ${MIN_QUIZ_LENGTH}, but only ${totalAvailable} unique questions available across all quizzes.`
      );
    }
    
    // Combine main quiz questions with additional questions
    quizData = [...quizData, ...additionalQuestions];
  }
  
  // Shuffle all questions
  return shuffleArray(quizData);
};
