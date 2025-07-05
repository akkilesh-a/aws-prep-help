import { createHash } from "crypto";

// Generate a consistent cache key from question and options
export function generateCacheKey(
  question: string,
  options: string[],
  correctAnswer: string | string[]
): string {
  // Normalize the question text (remove extra whitespace, lowercase for consistency)
  const normalizedQuestion = question.trim().toLowerCase();

  // Normalize and sort options alphabetically for consistent ordering
  const normalizedAndSortedOptions = options
    .map((option) => option.trim().toLowerCase())
    .sort();

  // Normalize correct answer (sort if array, lowercase if string)
  const normalizedCorrectAnswer = Array.isArray(correctAnswer)
    ? correctAnswer
        .map((answer) => answer.trim().toLowerCase())
        .sort()
        .join(",")
    : correctAnswer.trim().toLowerCase();

  // Create a consistent content string
  const content = `${normalizedQuestion}:${normalizedAndSortedOptions.join(
    "|"
  )}:${normalizedCorrectAnswer}`;

  // Generate SHA256 hash for the cache key
  return `ai-explanation:${createHash("sha256").update(content).digest("hex")}`;
}
