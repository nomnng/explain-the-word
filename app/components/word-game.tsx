"use client";

import { useState } from "react";

type EvaluationResult = {
	score: number;
	explanation: string;
	feedback: string;
};

type WordGameProps = {
	initialWord: string;
};

function scoreTone(score: number): string {
	if (score >= 80) {
		return "text-emerald-600 dark:text-emerald-400";
	}

	if (score >= 50) {
		return "text-amber-600 dark:text-amber-400";
	}

	return "text-rose-600 dark:text-rose-400";
}

export function WordGame({ initialWord }: WordGameProps) {
	const [word, setWord] = useState(initialWord);
	const [description, setDescription] = useState("");
	const [result, setResult] = useState<EvaluationResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingWord, setIsLoadingWord] = useState(false);

	async function loadNewWord() {
		setIsLoadingWord(true);
		setError(null);

		try {
			const response = await fetch("/api/word");
			const data = (await response.json()) as { word?: string; error?: string };

			if (!response.ok || !data.word) {
				throw new Error(data.error ?? "Could not load a new word");
			}

			setWord(data.word);
			setDescription("");
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

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmed = description.trim();

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
				body: JSON.stringify({ word, description: trimmed }),
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
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
			<header className="space-y-3">
				<h1 className="text-4xl uppercase font-semibold tracking-widest text-center">
					Explain the word
				</h1>
				<p className="text-lg leading-8">
					Describe the word in your own words. An AI judge will score your
					answer out of 100 and share the real definition.
				</p>
			</header>

			<section className="rounded-3xl border-2 border-foreground p-8 shadow-sm bg-primary">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-sm">
							Your word
						</p>
						<p className="mt-1 text-4xl font-semibold capitalize">
							{word}
						</p>
					</div>

					<button
						type="button"
						onClick={loadNewWord}
						disabled={isLoadingWord || isSubmitting}
						className="rounded-full px-4 py-2 text-sm bg-foreground text-black hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoadingWord ? "Loading..." : "New word"}
					</button>
				</div>

				<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
					<label className="block space-y-2" htmlFor="description">
						<span className="text-sm">
							Your definition
						</span>
						<textarea
							id="description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							rows={6}
							maxLength={2000}
							disabled={isSubmitting}
							placeholder="Explain the meaning as clearly as you can..."
							className="mt-1 w-full resize-none rounded-2xl border border-foreground bg-secondary px-4 py-3 outline-none disabled:opacity-60"
						/>
					</label>

					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="text-sm">
							{description.length}/2000
						</p>

						<button
							type="submit"
							disabled={isSubmitting || isLoadingWord}
							className="rounded-full bg-foreground text-black px-6 py-3 text-sm hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? "Scoring..." : "Submit definition"}
						</button>
					</div>
				</form>

				{error ? (
					<p className="mt-6 rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
						{error}
					</p>
				) : null}
			</section>

			{result ? (
				<section className="rounded-3xl border-2 border-foreground bg-primary p-8">
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div>
							<p className="text-md font-light uppercase tracking-widest">
								Your score
							</p>
							<p
								className={`mt-2 text-6xl font-semibold tabular-nums ${scoreTone(result.score)}`}
							>
								{result.score}
								<span className="text-2xl text-foreground">
									/100
								</span>
							</p>
						</div>
					</div>

					<div className="mt-8 space-y-6">
						<div>
							<h2 className="text-md font-light uppercase tracking-widest">
								Feedback
							</h2>
							<p className="mt-2 text-base leading-7">
								{result.feedback}
							</p>
						</div>

						<div>
							<h2 className="text-md font-light uppercase tracking-widest">
								What it means
							</h2>
							<p className="mt-2 text-base leading-7">
								{result.explanation}
							</p>
						</div>
					</div>
				</section>
			) : null}
		</div>
	);
}