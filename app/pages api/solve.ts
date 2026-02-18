import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question required" });
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

    return res.status(200).json({
      answer:
        data?.choices?.[0]?.message?.content || "No response from model",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
