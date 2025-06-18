import redis from "@/lib/redis";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";

const requestSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  selectedAnswer: z.string(),
  isCorrect: z.boolean(),
});

const responseSchema = z.object({
  explanation: z.object({
    whyCorrect: z.string().describe("Explanation of why the answer is correct"),
    whyOthersWrong: z
      .string()
      .describe("Explanation of why other options are wrong"),
    additionalPoints: z
      .string()
      .describe("Additional important points about the topic"),
    bestPractices: z
      .string()
      .describe("Best practices and recommendations related to this topic"),
  }),
});

// Generate a consistent cache key from question and options
function generateCacheKey(question: string, options: string[]): string {
  const content = `${question}:${options.sort().join("|")}`;
  return `ai-explanation:${createHash('sha256').update(content).digest('hex')}`;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let cacheHit = false;
  
  try {
    const body = await req.json();
    const { question, options, correctAnswer, selectedAnswer, isCorrect } =
      requestSchema.parse(body);

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // Generate a proper cache key
    const cacheKey = generateCacheKey(question, options);

    // Try to get cached explanation
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      cacheHit = true;
      // Parse the cached data back to object
      const explanation = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      
      const responseTime = Date.now() - startTime;
      console.log(`[AI API] Cache HIT - Response time: ${responseTime}ms - Key: ${cacheKey.substring(0, 20)}...`);
      
      return new Response(JSON.stringify(explanation), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate new explanation if not cached
    const { object: explanation } = await generateObject({
      model: google("gemini-2.0-flash-lite"),
      schema: responseSchema,
      system: `# Role
              You are an AWS expert explaining practice exam questions.

              # Rules **IMPORTANT**
              - Output JSON matching schema exactly
              - Be concise but thorough in explanations
              - Focus on AWS best practices and official documentation
              - Explain concepts clearly for someone studying for AWS certification
              - Include relevant AWS service features and use cases
              - Highlight key differences between similar services
              - Mention any relevant AWS pricing considerations
              - Include any relevant AWS security or compliance aspects

              # Response Structure
              - whyCorrect: Explain why the answer is correct and its benefits
              - whyOthersWrong: Explain why the other options are incorrect
              - additionalPoints: Add any relevant AWS concepts or related services
              - bestPractices: Provide best practices and recommendations`,
                prompt: `Question: ${question}
                Options: ${options.join(", ")}
                Correct Answer: ${
                        Array.isArray(correctAnswer) ? correctAnswer.join(", ") : correctAnswer
                      }
                Selected Answer: ${selectedAnswer}
                Is Correct: ${isCorrect}

                Please provide a detailed explanation of why the answer is correct, why other options are wrong, and any additional points about this topic.`,
    });

    // Cache the explanation permanently (no expiration)
    await redis.set(cacheKey, JSON.stringify(explanation));

    const responseTime = Date.now() - startTime;
    console.log(`[AI API] Cache MISS - Response time: ${responseTime}ms - Key: ${cacheKey.substring(0, 20)}...`);

    return new Response(JSON.stringify(explanation), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const responseTime = Date.now() - startTime;
    console.error(`[AI API] ERROR - Response time: ${responseTime}ms - Cache hit: ${cacheHit}`, error);

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return new Response(firstError.message, {
        status: 400,
      });
    }

    return new Response("Error generating explanation", { status: 500 });
  }
}
