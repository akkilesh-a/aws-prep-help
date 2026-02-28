"use client";

import { Question } from "@/types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { QuestionCard } from "./question-card";
import { SelectedOptions } from "./types";
import { Button } from "@/components/ui";
import { H1 } from "@/components/typography";

const QUIZ_DURATION_SECONDS = 90 * 60;

type PersistedQuizState = {
  selectedOptions: SelectedOptions[];
  isSubmitted: boolean;
  isPaused: boolean;
  score: number;
  bestScore: number;
  timeLeft: number;
  questionOrder: string[];
};

export const Quiz = ({ questions }: { questions: Question[] }) => {
  const pathname = usePathname();
  const storageKey = useMemo(() => `quiz-state:${pathname}`, [pathname]);

  const [orderedQuestions, setOrderedQuestions] = useState<Question[]>(questions);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [timerAnnouncement, setTimerAnnouncement] = useState("");
  const [isStateRestored, setIsStateRestored] = useState(false);

  const timeLeftRef = useRef<number>(QUIZ_DURATION_SECONDS);
  const announcedThresholdsRef = useRef<Set<number>>(new Set());
  const previousLowTimeRef = useRef<boolean | null>(null);
  const previousCriticalTimeRef = useRef<boolean | null>(null);

  const handleSetSelectedOptions = (value: SelectedOptions) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((opt) => opt.question !== value.question);
      return [...filtered, value];
    });
  };

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
            isPaused: false,
            score: 0,
            bestScore: 0,
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
        const reorderedFromSavedState = parsedState.questionOrder
          .map((q) => questions.find((question) => question.question === q))
          .filter((q) => q !== undefined) as Question[];

        const existingQuestionsInSavedOrder = new Set(
          reorderedFromSavedState.map((question) => question.question)
        );
        const newlyAddedQuestions = questions.filter(
          (question) => !existingQuestionsInSavedOrder.has(question.question)
        );

        setOrderedQuestions([...reorderedFromSavedState, ...newlyAddedQuestions]);
      } else {
        setOrderedQuestions(questions);
      }

      if (Array.isArray(parsedState.selectedOptions)) {
        setSelectedOptions(parsedState.selectedOptions);
      }
      if (typeof parsedState.isSubmitted === "boolean") {
        setIsSubmitted(parsedState.isSubmitted);
      }
      if (typeof parsedState.isPaused === "boolean") {
        setIsPaused(parsedState.isPaused);
      }
      if (typeof parsedState.score === "number") {
        setScore(parsedState.score);
      }
      if (typeof parsedState.bestScore === "number") {
        setBestScore(parsedState.bestScore);
      } else if (typeof parsedState.score === "number") {
        setBestScore(parsedState.score);
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
      isPaused,
      score,
      bestScore,
      timeLeft: timeLeftRef.current,
      questionOrder: orderedQuestions.map((q) => q.question),
    };

    localStorage.setItem(storageKey, JSON.stringify(stateToPersist));
  }, [isStateRestored, selectedOptions, isSubmitted, isPaused, score, bestScore, storageKey, orderedQuestions]);

  // Save state helper function for use in event listeners
  const saveState = useCallback(() => {
    if (typeof window === "undefined" || !isStateRestored) return;

    const stateToPersist: PersistedQuizState = {
      selectedOptions,
      isSubmitted,
      isPaused,
      score,
      bestScore,
      timeLeft: timeLeftRef.current,
      questionOrder: orderedQuestions.map((q) => q.question),
    };

    localStorage.setItem(storageKey, JSON.stringify(stateToPersist));
  }, [isStateRestored, selectedOptions, isSubmitted, isPaused, score, bestScore, storageKey, orderedQuestions]);

  const handleClearAnswers = useCallback(() => {
    if (isSubmitted || isPaused) return;
    setSelectedOptions([]);
  }, [isSubmitted, isPaused]);

  const handleTogglePause = useCallback(() => {
    if (isSubmitted) return;
    setIsPaused((prev) => !prev);
  }, [isSubmitted]);

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
    setBestScore((previousBest) => Math.max(previousBest, correctCount));
    setIsSubmitted(true);
  }, [isSubmitted, orderedQuestions, selectedOptions]);

  useEffect(() => {
    if (!isStateRestored || isSubmitted || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        timeLeftRef.current = newTime;
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStateRestored, isSubmitted, isPaused]);

  useEffect(() => {
    if (!isSubmitted && timeLeft === 0) {
      handleSubmit();
    }
  }, [handleSubmit, isSubmitted, timeLeft]);

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
  const totalQuestions = orderedQuestions.length;
  const answeredSelectionCount = selectedOptions.filter(
    (selection) => Array.isArray(selection.selectedOptions) && selection.selectedOptions.length > 0
  ).length;
  const answeredQuestions = isSubmitted
    ? totalQuestions
    : Math.min(answeredSelectionCount, totalQuestions);
  const answeredProgress = totalQuestions === 0 ? 0 : (answeredQuestions / totalQuestions) * 100;
  const isLowTime = timeLeft <= 10 * 60;
  const isCriticalTime = timeLeft <= 5 * 60;

  useEffect(() => {
    if (isSubmitted) return;

    let nextAnnouncement = "";

    if (timeLeft === 30 * 60 && !announcedThresholdsRef.current.has(30 * 60)) {
      announcedThresholdsRef.current.add(30 * 60);
      nextAnnouncement = "30 minutes remaining.";
    } else if (timeLeft === 10 * 60 && !announcedThresholdsRef.current.has(10 * 60)) {
      announcedThresholdsRef.current.add(10 * 60);
      nextAnnouncement = "10 minutes remaining.";
    } else if (timeLeft === 5 * 60 && !announcedThresholdsRef.current.has(5 * 60)) {
      announcedThresholdsRef.current.add(5 * 60);
      nextAnnouncement = "5 minutes remaining.";
    } else if (timeLeft === 0) {
      nextAnnouncement = "Time is up.";
    } else {
      const previousLowTime = previousLowTimeRef.current;
      const previousCriticalTime = previousCriticalTimeRef.current;

      if (previousCriticalTime === false && isCriticalTime) {
        nextAnnouncement = "5 minutes remaining.";
      } else if (previousLowTime === false && isLowTime) {
        nextAnnouncement = "10 minutes remaining.";
      }
    }

    if (nextAnnouncement) {
      setTimerAnnouncement(nextAnnouncement);
    }

    previousLowTimeRef.current = isLowTime;
    previousCriticalTimeRef.current = isCriticalTime;
  }, [timeLeft, isLowTime, isCriticalTime, isSubmitted]);

  return (
    <div className="space-y-4">
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {timerAnnouncement}
      </div>
      <div className="sticky top-16 z-10 flex items-center justify-between gap-4 rounded-lg border px-4 py-2 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="text-sm tabular-nums text-muted-foreground">
            {answeredQuestions}/{totalQuestions}
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted ring-1 ring-border">
            <div className="h-full bg-primary transition-all" style={{ width: `${answeredProgress}%` }} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div
            className={`rounded-md border px-3 py-1 font-bold tabular-nums text-lg leading-none ${
              isCriticalTime
                ? "border-destructive text-destructive bg-destructive/10"
                : isLowTime
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-foreground bg-muted/40"
            }`}
            role="timer"
            aria-live="off"
          >
            {formattedTimeLeft}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePause}
            disabled={isSubmitted}
            className="text-xs"
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAnswers}
            disabled={isSubmitted || isPaused}
            className="text-xs"
          >
            Clear Answers
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
          isPaused={isPaused}
          questionNumber={index + 1}
        />
      ))}
      {!isSubmitted && (
        <div className="flex justify-center">
          <Button className="w-96 h-10 text-md" onClick={handleSubmit} disabled={isPaused}>
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
    </div>
  );
};
