import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  AI_CONFIG,
  VALIDATION_LIMITS,
  ERROR_MESSAGES,
  AI_PROMPTS,
} from "@/constants/ai";

type CoverLetterRequest = {
  jobTitle: string;
  company: string;
  skills: string;
  additionalDetails: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, company, skills, additionalDetails }: CoverLetterRequest =
      await request.json();

    if (!jobTitle || !company || !skills || !additionalDetails) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.allFieldsRequired },
        { status: 400 }
      );
    }

    if (
      additionalDetails.length > VALIDATION_LIMITS.additionalDetailsMaxLength
    ) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.additionalDetailsTooLong },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [
        {
          role: "system",
          content: AI_PROMPTS.systemPrompt,
        },
        {
          role: "user",
          content: AI_PROMPTS.getUserPrompt(
            jobTitle,
            company,
            skills,
            additionalDetails
          ),
        },
      ],
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    });

    const coverLetter = completion.choices[0]?.message?.content;

    if (!coverLetter) {
      throw new Error(ERROR_MESSAGES.generationFailed);
    }

    return NextResponse.json({
      coverLetter: coverLetter.trim(),
      usage: {
        total_tokens: completion.usage?.total_tokens || 0,
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
      },
    });
  } catch (error) {
    console.error("Error generating cover letter:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.generationError(error.message) },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.internalServerError },
      { status: 500 }
    );
  }
}
