import { H1 } from "@/components/typography";
import { getCertificationQuizQuestions } from "@/lib";
import React from "react";
import { Quiz } from "./_components";

const CertificationQuizPage = async ({
  params,
}: {
  params: { certification: string; examName: string };
}) => {
  const { certification, examName } = params;
  const examNameFormatted = examName.toUpperCase().replace(/-/g, " ");
  const certificationFolder = certification.toLocaleLowerCase();
  const questions = await getCertificationQuizQuestions(
    certificationFolder,
    examName.toLowerCase()
  );

  return (
    <div className="space-y-4">
      <H1>{examNameFormatted}</H1>
      <Quiz questions={questions} />
    </div>
  );
};

export default CertificationQuizPage;
