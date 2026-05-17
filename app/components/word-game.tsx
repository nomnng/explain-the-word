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
				<p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
					Explain the word
				</p>
				<h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
					What does this word mean?
				</h1>
				<p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
					Describe the word in your own words. An AI judge will score your
					answer out of 100 and share the real definition.
				</p>
			</header>

			<section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							Your word
						</p>
						<p className="mt-1 text-4xl font-semibold capitalize text-zinc-900 dark:text-zinc-50">
							{word}
						</p>
					</div>

					<button
						type="button"
						onClick={loadNewWord}
						disabled={isLoadingWord || isSubmitting}
						className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
					>
						{isLoadingWord ? "Loading..." : "New word"}
					</button>
				</div>

				<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
					<label className="block space-y-2" htmlFor="description">
						<span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
							className="w-full resize-none rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
						/>
					</label>

					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							{description.length}/2000
						</p>

						<button
							type="submit"
							disabled={isSubmitting || isLoadingWord}
							className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
						>
							{isSubmitting ? "Scoring..." : "Submit definition"}
						</button>
					</div>
				</form>

				{error ? (
					<p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300">
						{error}
					</p>
				) : null}
			</section>

			{result ? (
				<section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/40">
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div>
							<p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
								Your score
							</p>
							<p
								className={`mt-2 text-6xl font-semibold tabular-nums ${scoreTone(result.score)}`}
							>
								{result.score}
								<span className="text-2xl text-zinc-500 dark:text-zinc-400">
									/100
								</span>
							</p>
						</div>
					</div>

					<div className="mt-8 space-y-6">
						<div>
							<h2 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
								Feedback
							</h2>
							<p className="mt-2 text-base leading-7 text-zinc-700 dark:text-zinc-300">
								{result.feedback}
							</p>
						</div>

						<div>
							<h2 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
								What it means
							</h2>
							<p className="mt-2 text-base leading-7 text-zinc-700 dark:text-zinc-300">
								{result.explanation}
							</p>
						</div>
					</div>
				</section>
			) : null}
		</div>
	);
}