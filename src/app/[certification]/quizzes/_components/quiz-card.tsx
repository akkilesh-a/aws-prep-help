"use client";

import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PersistedQuizState = {
  selectedOptions?: Array<{ question?: string }>;
  questionOrder?: string[];
};

type QuizCardProps = {
  name: string;
  length: number;
  certificationFolder: string;
};

export const QuizCard = ({ name, length, certificationFolder }: QuizCardProps) => {
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(length);

  const quizURL = useMemo(() => {
    const regex = / /g;
    return `/quizzes/${certificationFolder
      .toLowerCase()
      .replace(regex, "-")}/${name.toLowerCase().replace(regex, "-")}`;
  }, [certificationFolder, name]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawState = localStorage.getItem(`quiz-state:${quizURL}`);
      if (!rawState) {
        setAnsweredCount(0);
        setTotalQuestions(length);
        return;
      }

      const parsedState = JSON.parse(rawState) as PersistedQuizState;
      const storedTotalQuestions =
        Array.isArray(parsedState.questionOrder) && parsedState.questionOrder.length > 0
          ? parsedState.questionOrder.length
          : length;

      const answeredQuestions = new Set(
        Array.isArray(parsedState.selectedOptions)
          ? parsedState.selectedOptions
              .map((option) => option.question)
              .filter((question): question is string => typeof question === "string")
          : []
      );

      setAnsweredCount(Math.min(answeredQuestions.size, storedTotalQuestions));
      setTotalQuestions(storedTotalQuestions);
    } catch {
      setAnsweredCount(0);
      setTotalQuestions(length);
    }
  }, [length, quizURL]);

  const progressPercentage = totalQuestions === 0 ? 0 : (answeredCount / totalQuestions) * 100;
  const roundedProgressPercentage = Math.round(progressPercentage);
  const progressStatus = answeredCount === 0
    ? "Not started"
    : answeredCount === totalQuestions
      ? "Completed"
      : "In progress";

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>Questions: {length.toString()}</CardDescription>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progressStatus}</span>
              <span>
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <div
              className="relative h-5 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border"
              role="progressbar"
              aria-label={`${name} progress`}
              aria-valuemin={0}
              aria-valuemax={totalQuestions}
              aria-valuenow={answeredCount}
            >
              <div className="h-full bg-primary transition-all" style={{ width: `${progressPercentage}%` }} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-foreground">
                {roundedProgressPercentage}%
              </span>
            </div>
          </div>
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
