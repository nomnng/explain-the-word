type ExplanationEntryProps = {
	score: number;
	userExplanation: string;
	feedback: string;
	aiExplanation: string;
	createdAt: Date;
	wordType: string | null;
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

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

export function ExplanationEntry({
	score,
	userExplanation,
	feedback,
	aiExplanation,
	createdAt,
	wordType,
}: ExplanationEntryProps) {
	return (
		<article className="rounded-3xl border-2 border-foreground bg-primary p-8 shadow-sm">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-md font-light uppercase tracking-widest">Score</p>
					<p
						className={`mt-2 text-5xl font-semibold tabular-nums ${scoreTone(score)}`}
					>
						{score}
						<span className="text-xl text-foreground">/100</span>
					</p>
				</div>
				<p className="text-sm text-foreground/70">{formatDate(createdAt)}</p>
			</div>

			{wordType ? (
				<p className="mt-4">
					<span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize">
						{wordType}
					</span>
				</p>
			) : null}

			<div className="mt-8 space-y-6">
				<div>
					<h2 className="text-md font-light uppercase tracking-widest">
						Player definition
					</h2>
					<p className="mt-2 text-base leading-7 whitespace-pre-wrap">
						{userExplanation}
					</p>
				</div>

				<div>
					<h2 className="text-md font-light uppercase tracking-widest">
						Feedback
					</h2>
					<p className="mt-2 text-base leading-7">{feedback}</p>
				</div>

				<div>
					<h2 className="text-md font-light uppercase tracking-widest">
						What it means
					</h2>
					<p className="mt-2 text-base leading-7">{aiExplanation}</p>
				</div>
			</div>
		</article>
	);
}
