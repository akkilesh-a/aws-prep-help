"use client";

import { P } from "@/components/typography";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PersistedQuizState = {
  selectedOptions?: Array<{ question?: string }>;
  isSubmitted?: boolean;
};

type CertificationCardProps = {
  name: string;
  logo: string;
  quizes: number;
};

export const CertificationCard = ({
  name,
  logo,
  quizes,
}: CertificationCardProps) => {
  const [attemptedQuizzes, setAttemptedQuizzes] = useState(0);

  const imgURL = "/certifications/" + logo;
  const regex = / /g;
  const certificationSlug = name.toLowerCase().replace(regex, "-");
  const quizURL = `/${certificationSlug}/quizzes`;

  const storagePrefix = useMemo(
    () => `quiz-state:/quizzes/${certificationSlug}/`,
    [certificationSlug]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      let attemptedCount = 0;

      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (!key || !key.startsWith(storagePrefix)) {
          continue;
        }

        try {
          const rawState = localStorage.getItem(key);
          if (!rawState) {
            continue;
          }

          const parsedState = JSON.parse(rawState) as PersistedQuizState;
          const hasSelections =
            Array.isArray(parsedState.selectedOptions) &&
            parsedState.selectedOptions.length > 0;

          if (hasSelections || parsedState.isSubmitted) {
            attemptedCount += 1;
          }
        } catch {
          // Ignore malformed localStorage entries
        }
      }

      setAttemptedQuizzes(Math.min(attemptedCount, quizes));
    } catch {
      setAttemptedQuizzes(0);
    }
  }, [quizes, storagePrefix]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Image
            src={imgURL}
            className="w-64"
            alt={name}
            width={100}
            height={100}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <P>
            Attempted: {attemptedQuizzes}/{quizes}
          </P>
          <Button asChild>
            <Link href={quizURL}>
              View Quizzes
              <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
