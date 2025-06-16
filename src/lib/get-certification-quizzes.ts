import { promises as fs } from "fs";
import path from "path";

// Get all the quizzes for a certification
export const getCertificationQuizzes = async (certification: string) => {
  const certificationFolder = path.join(
    process.cwd(),
    `src/data/${certification}`
  );

  const certificationQuizzes = await fs.readdir(certificationFolder);
  const filteredQuizzes = certificationQuizzes.filter(
    (certificationQuiz) => certificationQuiz !== "config.json"
  );
  const removedJSONQuizzes = filteredQuizzes.map((quiz) => {
    return quiz.replace(".json", "").replace(/-/g, " ").toUpperCase();
  });

  // Sort the quizzes numerically
  const sortedQuizzes = removedJSONQuizzes.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });

  console.log(sortedQuizzes);
  return sortedQuizzes;
};
