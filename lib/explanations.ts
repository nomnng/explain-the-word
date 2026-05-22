import { prisma } from "@/lib/db";

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
