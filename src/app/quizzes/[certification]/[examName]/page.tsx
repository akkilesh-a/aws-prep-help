import { H1 } from "@/components/typography";
import { getCertificationQuizQuestions } from "@/lib";
import React from "react";
import { Quiz } from "./_components";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui";
import Link from "next/link";

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
      <div className="flex justify-between items-center mb-6">
        <H1>{examNameFormatted}</H1>
        <Button variant="outline" asChild>
          <Link href={`/${certification}/quizzes`}>Return</Link>
        </Button>
      </div>
      <Quiz questions={questions} />
    </PageWrapper>
  );
};

export default CertificationQuizPage;
