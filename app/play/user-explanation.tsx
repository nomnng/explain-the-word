"use client";

import { useState } from "react";
import { WordEntry } from "@/lib/words";

type UserExplanationProps = {
	wordEntry: WordEntry;
	isLoading: boolean;
	onGetNewWord: () => void;
	onSubmit: (explanation: string) => void;
};

export function UserExplanation({ wordEntry, isLoading, onGetNewWord, onSubmit }: UserExplanationProps) {
	const [explanation, setExplanation] = useState("");

	const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(explanation);
	};

	return (
		<>
			<section className="rounded-3xl border-2 border-foreground p-8 shadow-sm bg-primary">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-sm">
							Your word
						</p>
						<p className="mt-1 text-4xl font-semibold capitalize">
							{wordEntry.word}
						</p>
					</div>

					<button
						type="button"
						onClick={onGetNewWord}
						disabled={isLoading}
						className="rounded-full px-4 py-2 text-sm bg-foreground text-black hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
					>
						New word
					</button>
				</div>

				<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
					<label className="block space-y-2" htmlFor="explanation">
						<span className="text-sm">
							Your definition
						</span>
						<textarea
							id="explanation"
							value={explanation}
							onChange={(event) => setExplanation(event.target.value)}
							rows={6}
							maxLength={2000}
							disabled={isLoading}
							placeholder="Explain the meaning as clearly as you can..."
							className="mt-1 w-full resize-none rounded-2xl border border-foreground bg-secondary px-4 py-3 outline-none disabled:opacity-60"
						/>
					</label>

					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="text-sm">
							{explanation.length}/2000
						</p>

						<button
							type="submit"
							disabled={isLoading}
							className="rounded-full bg-foreground text-black px-6 py-3 text-sm hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Submit definition
						</button>
					</div>
				</form>
			</section>
		</>
	);
}