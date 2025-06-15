import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { createFallback } from "ai-fallback";
import { NextRequest } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  selectedAnswer: z.string(),
});

const responseSchema = z.object({
  explanation: z.object({
    whySelectedWrong: z
      .string()
      .describe("Explanation of why the selected answer is wrong"),
    whyCorrectIsRight: z
      .string()
      .describe("Explanation of why the correct answer is right"),
    whyOthersWrong: z
      .string()
      .describe("Explanation of why other options are wrong"),
    additionalPoints: z
      .string()
      .describe("Additional important points about the topic"),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, options, correctAnswer, selectedAnswer } =
      requestSchema.parse(body);

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const model = createFallback({
      models: [
        groq("llama-3.3-70b-versatile"),
        google("gemini-2.0-flash-lite"),
      ],
      onError: (error: Error, modelId: string) => {
        console.error(`Error with model ${modelId}:`, error);
      },
      modelResetInterval: 60000,
    });

    const { object: explanation } = await generateObject({
      model,
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
    - whySelectedWrong: Explain why the user's selected answer is incorrect
    - whyCorrectIsRight: Explain why the correct answer is the best choice
    - whyOthersWrong: Explain why the other options are incorrect
    - additionalPoints: Add any relevant AWS concepts, best practices, or related services`,
      prompt: `Question: ${question}
Options: ${options.join(", ")}
Correct Answer: ${
        Array.isArray(correctAnswer) ? correctAnswer.join(", ") : correctAnswer
      }
Selected Answer: ${selectedAnswer}

Please provide a detailed explanation of why the selected answer is wrong, why the correct answer is right, why other options are wrong, and any additional points about this topic.`,
    });

    return new Response(JSON.stringify(explanation), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error(error);

    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return new Response(firstError.message, {
        status: 400,
      });
    }

    // Consider more specific error handling based on AI SDK errors if needed
    return new Response("Error generating explanation", { status: 500 });
  }
}
