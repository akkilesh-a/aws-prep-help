"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/components/ui";
import { Question } from "@/types";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface AIHelpProps {
  question: Question;
}

export const AIHelp = ({ question }: AIHelpProps) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleGetExplanation = () => {
    setShowExplanation(true);
  };

  if (!question.explanation) {
    return null;
  }

  return (
    <div className="mt-4">
      {!showExplanation && (
        <Button
          variant="outline"
          onClick={handleGetExplanation}
          className="w-full"
        >
          Get Explanation
        </Button>
      )}

      {showExplanation && question.explanation && (
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="why-correct">
            <AccordionTrigger>Why This Answer is Correct</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{question.explanation.whyCorrect}</ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="why-others">
            <AccordionTrigger>Why Other Options are Wrong</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {question.explanation.whyOthersWrong}
                </ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="additional">
            <AccordionTrigger>Additional Points</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {question.explanation.additionalPoints}
                </ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="best-practices">
            <AccordionTrigger>Best Practices</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {question.explanation.bestPractices}
                </ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
