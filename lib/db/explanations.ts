import { prisma } from "@/lib/prisma";

export type SaveExplanationInput = {
	word: string;
	wordType?: string;
	score: number;
	userExplanation: string;
	aiExplanation: string;
	feedback: string;
};

export async function saveExplanation(input: SaveExplanationInput) {
	return prisma.explanation.create({
		data: {
			word: input.word.trim(),
			wordType: input.wordType?.trim() || null,
			score: input.score,
			userExplanation: input.userExplanation.trim(),
			aiExplanation: input.aiExplanation.trim(),
			feedback: input.feedback.trim(),
		},
	});
}

export async function getExplanationsForWord(word: string) {
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
	return prisma.explanation.findMany({
		orderBy: { createdAt: "desc" },
		take: limit,
	});
}
