import { readFileSync } from "fs";
import { join } from "path";

let cachedWords: string[] | null = null;

function loadWords(): string[] {
  if (cachedWords) {
    return cachedWords;
  }

  const filePath = join(process.cwd(), "word_list.txt");
  const text = readFileSync(filePath, "utf-8");

  cachedWords = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  return cachedWords;
}

export function getRandomWord(): string {
  const words = loadWords();

  if (words.length === 0) {
    throw new Error("word_list.txt has no words");
  }

  const index = Math.floor(Math.random() * words.length);
  return words[index];
}
