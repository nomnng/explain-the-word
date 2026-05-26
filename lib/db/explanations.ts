import { prisma } from "@/lib/prisma";
import { cacheTag, revalidateTag } from "next/cache";

export type SaveExplanationInput = {
	word: string;
	wordType?: string;
	score: number;
	userExplanation: string;
	aiExplanation: string;
	feedback: string;
};

export async function saveExplanation(input: SaveExplanationInput) {
	const data = {
		word: input.word.trim(),
		wordType: input.wordType?.trim() || null,
		score: input.score,
		userExplanation: input.userExplanation.trim(),
		aiExplanation: input.aiExplanation.trim(),
		feedback: input.feedback.trim(),
	};
	revalidateTag(`word-explanations-${data.word}`, {expire: 0});
	revalidateTag("all-word-explanations", {expire: 0});
	return prisma.explanation.create({ data });
}

export async function getExplanationsForWord(word: string) {
	"use cache";
	cacheTag(`word-explanations-${word}`);

	const normalized = word.trim();

	if (!normalized) {
		return [];
	}

	return prisma.explanation.findMany({
		where: {
			word: {
				equals: normalized,
				mode: "insensitive",
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

export async function getAllExplanations(limit: number = 5) {
	"use cache";
	cacheTag("all-word-explanations");

	return prisma.explanation.findMany({
		orderBy: { createdAt: "desc" },
		take: limit,
	});
}
