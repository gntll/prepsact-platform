'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createQuestion(formData) {
  const session = await auth();
  
  if (!session) {
    throw new Error("Unauthorized: You must be signed in to add questions.");
  }

  const section = formData.get("section");
  const domain = formData.get("domain");
  const difficulty = formData.get("difficulty");
  const passage = formData.get("passage");
  const prompt = formData.get("prompt");
  const explanation = formData.get("explanation");
  
  // Parse choices passed from the client form
  const choicesRaw = formData.get("choices");
  const choices = JSON.parse(choicesRaw);

  await prisma.question.create({
    data: {
      section,
      domain,
      difficulty,
      passage: passage ? passage : null,
      prompt,
      explanation: explanation ? explanation : null,
      choices: {
        create: choices.map((c, index) => ({
          label: ["A", "B", "C", "D"][index],
          text: c.text,
          isCorrect: c.isCorrect,
        })),
      },
    },
  });

  revalidatePath("/");
}
