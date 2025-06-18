import { H1 } from "@/components/typography";
import { getCertificationQuizQuestions } from "@/lib";
import React from "react";
import { Quiz } from "./_components";
import { PageWrapper } from "@/components/layout";

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
    <PageWrapper>
      <H1>{examNameFormatted}</H1>
      <Quiz questions={questions} />
    </PageWrapper>
  );
};

export default CertificationQuizPage;
