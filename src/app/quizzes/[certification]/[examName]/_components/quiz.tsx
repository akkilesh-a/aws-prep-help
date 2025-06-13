"use client";

import { Question } from "@/types";
import React, { useState } from "react";
import { QuestionCard } from "./question-card";
import { SelectedOptions } from "./types";
import { Button } from "@/components/ui";
import { H1 } from "@/components/typography";

export const Quiz = ({ questions }: { questions: Question[] }) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSetSelectedOptions = (value: SelectedOptions) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((opt) => opt.question !== value.question);
      return [...filtered, value];
    });
  };

  const handleSubmit = () => {
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
  };

  return (
    <div className="space-y-4">
      {questions.map((question: Question) => (
        <QuestionCard
          key={question.question}
          selectedOptions={selectedOptions}
          handleSetSelectedOptions={handleSetSelectedOptions}
          question={question}
          isSubmitted={isSubmitted}
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
        </div>
      )}
    </div>
  );
};
