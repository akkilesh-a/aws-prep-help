import { H1 } from "@/components/typography";
import { getCertificationQuizDetails, getCertificationQuizzes } from "@/lib";
import React from "react";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

  if (quizzes.length === 0) {
    return <div>No quizzes found</div>;
  }

  return (
    <div className="space-y-4">
      <H1>{certificationName}</H1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map(async (quiz) => {
          const quizFile = quiz.replace(/ /g, "-").toLocaleLowerCase();
          const quizLength = await getCertificationQuizDetails(
            certificationFolder,
            quizFile
          );
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
    </div>
  );
};

const QuizCard = ({
  name,
  length,
  certificationFolder,
}: {
  name: string;
  length: number;
  certificationFolder: string;
}) => {
  const regex = / /g;
  const quizURL = `/quizzes/${certificationFolder
    .toLowerCase()
    .replace(regex, "-")}/${name.toLowerCase().replace(regex, "-")}`;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>Questions: {length.toString()}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button size="icon" asChild>
            <Link href={quizURL}>
              <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizesPage;
