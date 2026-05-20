import { readFileSync } from "fs";
import { join } from "path";

export type WordEntry = {
	word: string;
	type: string;
	CEFR: string;
};

let cachedWords: WordEntry[] | null = null;

function loadWords(): WordEntry[] {
	if (cachedWords) {
		return cachedWords;
	}

	const filePath = join(process.cwd(), "words.json");
	const text = readFileSync(filePath, "utf-8");

	cachedWords = JSON.parse(text) as WordEntry[];
	
	return cachedWords;
}

export function getRandomWord(): WordEntry {
	const words = loadWords();

	if (words.length === 0) {
		throw new Error("No words was loaded");
	}

	const index = Math.floor(Math.random() * words.length);
	return words[index];
}
