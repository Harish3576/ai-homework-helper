export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a helpful homework assistant.",
            },
            { role: "user", content: question },
          ],
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      answer: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
