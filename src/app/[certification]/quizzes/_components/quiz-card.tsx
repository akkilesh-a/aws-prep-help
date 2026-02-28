"use client";

import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PersistedQuizState = {
  selectedOptions?: Array<{ question?: string }>;
  questionOrder?: string[];
  isSubmitted?: boolean;
  score?: number;
  bestScore?: number;
};

type QuizCardProps = {
  name: string;
  length: number;
  certificationFolder: string;
};

export const QuizCard = ({ name, length, certificationFolder }: QuizCardProps) => {
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(length);
  const [highestScore, setHighestScore] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const quizURL = useMemo(() => {
    const regex = / /g;
    return `/quizzes/${certificationFolder
      .toLowerCase()
      .replace(regex, "-")}/${name.toLowerCase().replace(regex, "-")}`;
  }, [certificationFolder, name]);
  const storageKey = useMemo(() => `quiz-state:${quizURL}`, [quizURL]);

  const handleResetProgress = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(storageKey);
    setAnsweredCount(0);
    setTotalQuestions(length);
    setHighestScore(null);
    setShowResetConfirm(false);
  };

  const openResetConfirm = () => {
    setShowResetConfirm(true);
  };

  const closeResetConfirm = () => {
    setShowResetConfirm(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawState = localStorage.getItem(storageKey);
      if (!rawState) {
        setAnsweredCount(0);
        setTotalQuestions(length);
        setHighestScore(null);
        return;
      }

      const parsedState = JSON.parse(rawState) as PersistedQuizState;
      const storedTotalQuestions =
        Array.isArray(parsedState.questionOrder) && parsedState.questionOrder.length > 0
          ? parsedState.questionOrder.length
          : length;
      const totalQuestionsForProgress = Math.max(length, storedTotalQuestions);

      const answeredQuestions = new Set(
        Array.isArray(parsedState.selectedOptions)
          ? parsedState.selectedOptions
              .map((option) => option.question)
              .filter((question): question is string => typeof question === "string")
          : []
      );

      const answeredCountForDisplay = parsedState.isSubmitted
        ? totalQuestionsForProgress
        : Math.min(answeredQuestions.size, totalQuestionsForProgress);

      const savedBestScore =
        typeof parsedState.bestScore === "number"
          ? parsedState.bestScore
          : typeof parsedState.score === "number"
            ? parsedState.score
            : null;

      setAnsweredCount(answeredCountForDisplay);
      setTotalQuestions(totalQuestionsForProgress);
      setHighestScore(parsedState.isSubmitted ? savedBestScore : null);
    } catch {
      setAnsweredCount(0);
      setTotalQuestions(length);
      setHighestScore(null);
    }
  }, [length, storageKey]);

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
        <CardHeader className="space-y-3 pb-3">
          <CardTitle>{name}</CardTitle>
          <CardDescription>Questions: {length.toString()}</CardDescription>
          <div className="space-y-2 pt-1">
            <div className="flex min-h-4 items-center justify-between text-xs text-muted-foreground">
              <span>{progressStatus === "In progress" ? "" : progressStatus}</span>
              <span>
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <div
              className="relative h-3 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border"
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
            <div className="min-h-5 pt-1 text-xs text-muted-foreground">
              {highestScore !== null
                ? `Highest score: ${highestScore}/${totalQuestions}`
                : ""}
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex items-center justify-between pt-0">
          <Button variant="outline" size="sm" onClick={openResetConfirm}>
            Reset
          </Button>
          <Button size="icon" asChild>
            <Link href={quizURL}>
              <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-progress-title"
          onClick={closeResetConfirm}
        >
          <Card className="w-80" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4 p-6">
              <h3 id="reset-progress-title" className="text-base font-semibold">
                Reset progress?
              </h3>
              <p className="text-sm text-muted-foreground">
                This will clear saved answers and highest score for {name}.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={closeResetConfirm}>
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={handleResetProgress}>
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
