"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Loader,
} from "@/components/ui";
import { Question } from "@/types";
import { SelectedOptions } from "./types";
import { useState } from "react";
import { P } from "@/components/typography";

interface AIHelpProps {
  question: Question;
  selectedOptions: SelectedOptions[];
  isCorrect: boolean;
}

export const AIHelp = ({
  question,
  selectedOptions,
  isCorrect,
}: AIHelpProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<{
    whyCorrect: string;
    whyOthersWrong: string;
    additionalPoints: string;
    bestPractices: string;
  } | null>(null);

  const handleGetExplanation = async () => {
    setIsLoading(true);
    try {
      const currentSelection = selectedOptions.find(
        (opt) => opt.question === question.question
      );

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          selectedAnswer: currentSelection?.selectedOptions[0] || "",
          isCorrect,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get explanation");
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error getting explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={handleGetExplanation}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <div className="mr-2">
            <Loader />
          </div>
        ) : null}
        Get AI Explanation
      </Button>

      {explanation && (
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="why-correct">
            <AccordionTrigger>Why This Answer is Correct</AccordionTrigger>
            <AccordionContent>
              <P>{explanation.whyCorrect}</P>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="why-others">
            <AccordionTrigger>Why Other Options are Wrong</AccordionTrigger>
            <AccordionContent>
              <P>{explanation.whyOthersWrong}</P>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="additional">
            <AccordionTrigger>Additional Points</AccordionTrigger>
            <AccordionContent>
              <P>{explanation.additionalPoints}</P>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="best-practices">
            <AccordionTrigger>Best Practices</AccordionTrigger>
            <AccordionContent>
              <P>{explanation.bestPractices}</P>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
