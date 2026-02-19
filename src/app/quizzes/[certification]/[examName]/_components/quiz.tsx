"use client";

import { Question } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QuestionCard } from "./question-card";
import { SelectedOptions } from "./types";
import { Button } from "@/components/ui";
import { H1 } from "@/components/typography";

const QUIZ_DURATION_SECONDS = 90 * 60;

export const Quiz = ({ questions }: { questions: Question[] }) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);

  const handleSetSelectedOptions = (value: SelectedOptions) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((opt) => opt.question !== value.question);
      return [...filtered, value];
    });
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;

    let correctCount = 0;
    questions.forEach((question) => {
      const userSelection = selectedOptions.find(
        (opt) => opt.question === question.question
      );
      if (userSelection) {
        const isCorrect = Array.isArray(question.correctAnswer)
          ? JSON.stringify([...userSelection.selectedOptions].sort()) ===
            JSON.stringify([...(question.correctAnswer as string[])].sort())
          : userSelection.selectedOptions[0] === question.correctAnswer;
        if (isCorrect) correctCount++;
      }
    });
    setScore(correctCount);
    setIsSubmitted(true);
  }, [isSubmitted, questions, selectedOptions]);

  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  useEffect(() => {
    if (!isSubmitted && timeLeft === 0) {
      handleSubmit();
    }
  }, [handleSubmit, isSubmitted, timeLeft]);

  const formattedTimeLeft = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-10 flex items-center justify-between rounded-lg border px-4 py-2 bg-background/95 backdrop-blur-sm shadow-sm">
        <span className="text-sm font-medium">Quiz Timer</span>
        <span className="font-semibold tabular-nums">{formattedTimeLeft}</span>
      </div>
      {questions.map((question: Question, index: number) => (
        <QuestionCard
          key={question.question}
          selectedOptions={selectedOptions}
          handleSetSelectedOptions={handleSetSelectedOptions}
          question={question}
          isSubmitted={isSubmitted}
          questionNumber={index + 1}
        />
      ))}
      {!isSubmitted && (
        <div className="flex justify-center">
          <Button className="w-96 h-10 text-md" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
      {isSubmitted && (
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <H1>
            Score: <span className="text-primary">{score}</span>/
            {questions.length}
          </H1>
          {timeLeft === 0 && (
            <p className="mt-2 text-sm font-medium">Time is up.</p>
          )}
        </div>
      )}
    </div>
  );
};
