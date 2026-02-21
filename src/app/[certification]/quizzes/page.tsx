import { H1 } from "@/components/typography";
import { getCertificationQuizDetails, getCertificationQuizzes } from "@/lib";
import React from "react";
import { PageWrapper } from "@/components/layout";
import { QuizCard } from "./_components/quiz-card";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const QuizesPage = async ({
  params,
}: {
  params: { certification: string };
}) => {
  const { certification } = params;
  const regex = /-/g;
  const certificationName = certification
    .replace(regex, " ")
    .toLocaleUpperCase();

  const certificationFolder = certification.toLocaleLowerCase();

  const quizzes = await getCertificationQuizzes(certificationFolder);
  const quizLength = await getCertificationQuizDetails(certificationFolder);

  if (quizzes.length === 0) {
    return <div>No quizzes found</div>;
  }

  return (
    <PageWrapper>
      <div className="mb-4 flex items-center justify-between gap-2">
        <H1>{certificationName}</H1>
        <Button variant="outline" asChild>
          <Link href="/certifications">
            <ArrowLeft />
            Return
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => {
          return (
            <QuizCard
              key={quiz}
              name={quiz}
              length={quizLength}
              certificationFolder={certificationFolder}
            />
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default QuizesPage;
