"use client";

import { Question } from "@/types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { QuestionCard } from "./question-card";
import { SelectedOptions } from "./types";
import { Button, Card } from "@/components/ui";
import { H1 } from "@/components/typography";

const QUIZ_DURATION_SECONDS = 90 * 60;

type PersistedQuizState = {
  selectedOptions: SelectedOptions[];
  isSubmitted: boolean;
  score: number;
  timeLeft: number;
  questionOrder: string[];
};

export const Quiz = ({ questions }: { questions: Question[] }) => {
  const pathname = usePathname();
  const storageKey = useMemo(() => `quiz-state:${pathname}`, [pathname]);

  const [orderedQuestions, setOrderedQuestions] = useState<Question[]>(questions);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [isStateRestored, setIsStateRestored] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const resetTriggerRef = useRef<HTMLButtonElement>(null);
  const timeLeftRef = useRef<number>(QUIZ_DURATION_SECONDS);

  const handleSetSelectedOptions = (value: SelectedOptions) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((opt) => opt.question !== value.question);
      return [...filtered, value];
    });
  };

  const handleReset = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowResetConfirm(false);
    // Restore focus to the trigger button after modal closes
    setTimeout(() => {
      resetTriggerRef.current?.focus();
    }, 0);
  }, []);

  const confirmReset = useCallback(() => {
    localStorage.removeItem(storageKey);
    setOrderedQuestions(questions);
    setSelectedOptions([]);
    setIsSubmitted(false);
    setScore(0);
    setTimeLeft(QUIZ_DURATION_SECONDS);
    timeLeftRef.current = QUIZ_DURATION_SECONDS;
    closeModal();
  }, [storageKey, questions, closeModal]);

  // Restore quiz state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawState = localStorage.getItem(storageKey);
      if (!rawState) {
        // First time: save the incoming question order
        const initialOrder = questions.map((q) => q.question);
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            selectedOptions: [],
            isSubmitted: false,
            score: 0,
            timeLeft: QUIZ_DURATION_SECONDS,
            questionOrder: initialOrder,
          } as PersistedQuizState)
        );
        setOrderedQuestions(questions);
        setIsStateRestored(true);
        return;
      }

      const parsedState = JSON.parse(rawState) as Partial<PersistedQuizState>;

      // Restore and reorder questions based on saved order
      if (Array.isArray(parsedState.questionOrder)) {
        const reordered = parsedState.questionOrder
          .map((q) => questions.find((question) => question.question === q))
          .filter((q) => q !== undefined) as Question[];
        setOrderedQuestions(reordered);
      }

      if (Array.isArray(parsedState.selectedOptions)) {
        setSelectedOptions(parsedState.selectedOptions);
      }
      if (typeof parsedState.isSubmitted === "boolean") {
        setIsSubmitted(parsedState.isSubmitted);
      }
      if (typeof parsedState.score === "number") {
        setScore(parsedState.score);
      }
      if (
        typeof parsedState.timeLeft === "number" &&
        parsedState.timeLeft >= 0 &&
        parsedState.timeLeft <= QUIZ_DURATION_SECONDS
      ) {
        setTimeLeft(parsedState.timeLeft);
      }
    } catch {
      // If parsing fails, remove corrupt data
      localStorage.removeItem(storageKey);
      setOrderedQuestions(questions);
    } finally {
      setIsStateRestored(true);
    }
  }, [storageKey, questions]);

  // Save quiz state to localStorage whenever it changes
  useEffect(() => {
    if (!isStateRestored || typeof window === "undefined") return;

    const stateToPersist: PersistedQuizState = {
      selectedOptions,
      isSubmitted,
      score,
      timeLeft: timeLeftRef.current,
      questionOrder: orderedQuestions.map((q) => q.question),
    };

    localStorage.setItem(storageKey, JSON.stringify(stateToPersist));
  }, [isStateRestored, selectedOptions, isSubmitted, score, storageKey, orderedQuestions]);

  // Save state helper function for use in event listeners
  const saveState = useCallback(() => {
    if (typeof window === "undefined" || !isStateRestored) return;

    const stateToPersist: PersistedQuizState = {
      selectedOptions,
      isSubmitted,
      score,
      timeLeft: timeLeftRef.current,
      questionOrder: orderedQuestions.map((q) => q.question),
    };

    localStorage.setItem(storageKey, JSON.stringify(stateToPersist));
  }, [isStateRestored, selectedOptions, isSubmitted, score, storageKey, orderedQuestions]);

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;

    let correctCount = 0;
    orderedQuestions.forEach((question) => {
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
  }, [isSubmitted, orderedQuestions, selectedOptions]);

  useEffect(() => {
    if (!isStateRestored || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        timeLeftRef.current = newTime;
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStateRestored, isSubmitted]);

  useEffect(() => {
    if (!isSubmitted && timeLeft === 0) {
      handleSubmit();
    }
  }, [handleSubmit, isSubmitted, timeLeft]);

  // Handle modal accessibility: Escape key and focus trap
  useEffect(() => {
    if (!showResetConfirm) return;

    // Focus the cancel button when modal opens
    cancelButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === "Escape") {
        closeModal();
      }

      // Focus trap: keep focus within modal buttons
      if (e.key === "Tab") {
        const focusableElements = [cancelButtonRef.current, resetButtonRef.current];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showResetConfirm, closeModal]);

  // Save state on page hide/unload for safety
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePageHide = () => {
      saveState();
    };

    const handleBeforeUnload = () => {
      saveState();
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveState]);

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
        <div className="flex items-center gap-4">
          <span className="font-semibold tabular-nums">{formattedTimeLeft}</span>
          <Button
            ref={resetTriggerRef}
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs"
          >
            Reset Quiz
          </Button>
        </div>
      </div>
      {orderedQuestions.map((question: Question, index: number) => (
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
            {orderedQuestions.length}
          </H1>
          {timeLeft === 0 && (
            <p className="mt-2 text-sm font-medium">Time is up.</p>
          )}
        </div>
      )}

      {showResetConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-quiz-modal-title"
          onClick={closeModal}
        >
          <Card
            className="w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <h3 id="reset-quiz-modal-title" className="text-lg font-semibold">Reset Quiz?</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to reset this quiz? All progress and saved answers will be lost.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  ref={cancelButtonRef}
                  variant="outline"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  ref={resetButtonRef}
                  variant="destructive"
                  onClick={confirmReset}
                >
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
