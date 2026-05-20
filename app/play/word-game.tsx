"use client";

import { useState } from "react";
import { WordEntry } from "@/lib/words";
import { UserExplanation } from "./user-explanation";
import { Score } from "./score";

type EvaluationResult = {
	score: number;
	explanation: string;
	feedback: string;
};

type WordGameProps = {
	initialWord: WordEntry;
};

export function WordGame({ initialWord }: WordGameProps) {
	const [wordEntry, setWordEntry] = useState(initialWord);
	const [result, setResult] = useState<EvaluationResult | null>(null);
	const [error, setError] = useState<string | null>("Temporary error");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingWord, setIsLoadingWord] = useState(false);

	async function loadNewWord() {
		setIsLoadingWord(true);
		setError(null);

		try {
			const response = await fetch("/api/word");
			if (!response.ok) {
                const data = await response.json();
				throw new Error(data.error ?? "Could not load a new word");
			}

            const data = await response.json() as WordEntry;

			setWordEntry(data);
			setResult(null);
		} catch (loadError) {
			setError(
				loadError instanceof Error
					? loadError.message
					: "Could not load a new word",
			);
		} finally {
			setIsLoadingWord(false);
		}
	}

	async function submitExplanation(explanation: string) {
		const trimmed = explanation.trim();

		if (!trimmed) {
			setError("Write your definition before submitting.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/evaluate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ word: wordEntry.word, description: trimmed }),
			});

			const data = (await response.json()) as EvaluationResult & {
				error?: string;
			};

			if (!response.ok) {
				throw new Error(data.error ?? "Evaluation failed");
			}

			setResult({
				score: data.score,
				explanation: data.explanation,
				feedback: data.feedback,
			});
		} catch (submitError) {
			setResult(null);
			setError(
				submitError instanceof Error
					? submitError.message
					: "Evaluation failed",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
            {error ? (
                <p className="mt-6 rounded-2xl bg-rose-100 px-6 py-4 text-md text-rose-700">
                    {error}
                </p>
            ) : null}
			<UserExplanation
                wordEntry={wordEntry}
                isLoading={isLoadingWord || isSubmitting}
                onGetNewWord={() => loadNewWord()}
                onSubmit={(explanation: string) => { submitExplanation(explanation) }}
            />
            {result && 
                <Score
                    score={result.score}
                    explanation={result.explanation}
                    feedback={result.feedback}
                />
            }
		</>
	);
}