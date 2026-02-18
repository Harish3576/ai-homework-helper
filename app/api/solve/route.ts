export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { checkAndIncrementUsage } from "@/src/lib/usage";
import { groqSolve } from "@/src/lib/groq";
import { prisma } from "@/src/lib/prisma";

function getIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return "local";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const question = String(body.question ?? "").trim();
  if (!question) return NextResponse.json({ error: "Question is required." }, { status: 400 });

  const ip = getIp(req);
  const usage = checkAndIncrementUsage(ip);
  if (!usage.ok) {
    return NextResponse.json({ error: "LIMIT_REACHED", limit: usage.limit }, { status: 429 });
  }

  const answer = await groqSolve(question);

  await prisma.submission.create({
    data: { ip, question, answer },
  });

  return NextResponse.json({ answer, remaining: usage.remaining });
}
