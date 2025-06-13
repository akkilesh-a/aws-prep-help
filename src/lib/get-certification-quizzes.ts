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

  return removedJSONQuizzes;
};

