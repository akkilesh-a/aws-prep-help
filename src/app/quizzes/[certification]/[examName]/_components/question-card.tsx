"use client";

import { H4 } from "@/components/typography";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Loader,
} from "@/components/ui";
import { Question } from "@/types";
import { useEffect, useState } from "react";
import { AIHelp } from "./ai-help";
import { Options } from "./options";
import { SelectedOptions } from "./types";

export const QuestionCard = ({
  question,
  selectedOptions,
  handleSetSelectedOptions,
  isSubmitted,
  questionNumber,
}: {
  question: Question;
  selectedOptions: SelectedOptions[];
  handleSetSelectedOptions: (value: SelectedOptions) => void;
  isSubmitted: boolean;
  questionNumber: number;
}) => {
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);

  useEffect(() => {
    setShuffledOptions([...question.options].sort(() => Math.random() - 0.5));
    setIsOptionsLoading(false);
  }, [question.question]);

  const currentSelection = selectedOptions.find(
    (opt) => opt.question === question.question
  );

  const isCorrect = currentSelection
    ? Array.isArray(question.correctAnswer)
      ? JSON.stringify([...currentSelection.selectedOptions].sort()) ===
        JSON.stringify([...(question.correctAnswer as string[])].sort())
      : currentSelection.selectedOptions[0] === question.correctAnswer
    : false;

  return (
    <Card
      className={
        isSubmitted ? (isCorrect ? "border-green-500" : "border-red-500") : ""
      }
    >
      <CardHeader>
        <CardTitle>
          <H4>
            {questionNumber}. {question.question}
          </H4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isOptionsLoading ? (
          <Loader />
        ) : (
          <>
            <Options
              options={shuffledOptions}
              correctAnswer={question.correctAnswer}
              selectedOptions={
                Array.isArray(currentSelection?.selectedOptions)
                  ? currentSelection.selectedOptions
                  : []
              }
              handleSetSelectedOptions={(options) =>
                handleSetSelectedOptions({
                  question: question.question,
                  selectedOptions: options,
                })
              }
              isSubmitted={isSubmitted}
            />
            {isSubmitted && <AIHelp question={question} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};
