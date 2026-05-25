"use client";

import { Score } from "@/app/components/score";
import { Explanation } from "@/lib/generated/prisma/client";
import { useState } from "react";

type ExplanationEntryProps = {
    explanation: Explanation;
};

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

export function ExplanationEntry({ explanation }: ExplanationEntryProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<article className="rounded-3xl border-2 border-foreground bg-primary p-6 pb-3 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2.5">
					<div className="flex flex-wrap items-center gap-3">
						<h3 className="text-2xl font-bold tracking-tight text-card-foreground capitalize">
							{explanation.word}
						</h3>
						{explanation.wordType && (
							<span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
								{explanation.wordType}
							</span>
						)}
					</div>
					<div className="flex items-center">
						<Score score={explanation.score} enlarge={false} />
					</div>
				</div>
                <p className="text-sm text-foreground/70">{formatDate(explanation.createdAt)}</p>
			</div>

            <div className="mt-4 border-t border-muted pt-4 space-y-6">
				<div>
					<h2 className="text-md font-light uppercase tracking-widest pb-2">
						User explanation
					</h2>

					<p className="text-base leading-relaxed text-card-foreground/90">
						{explanation.userExplanation}
					</p>
				</div>
				{isExpanded && (
					<>
						<div>
							<h2 className="text-md font-light uppercase tracking-widest">
								Feedback
							</h2>
							<p className="mt-2 text-base leading-7">
								{explanation.feedback}
							</p>
						</div>
						<div>
							<h2 className="text-md font-light uppercase tracking-widest">
								What it means
							</h2>
							<p className="mt-2 text-base leading-7">
								{explanation.aiExplanation}
							</p>
						</div>
					</>
				)}
			</div>

			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="my-2 bg-secondary hover:bg-secondary/80 rounded-full w-full text-sm font-semibold text-card-foreground focus:outline-none"
			>
				{isExpanded ? "Show less 🡡" : "Show more 🡣"}
			</button>
		</article>
	);
}
