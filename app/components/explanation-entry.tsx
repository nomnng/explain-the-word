import { Score } from "@/app/components/score";
import { Explanation } from "@/lib/generated/prisma/client";

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
	return (
		<article className="rounded-3xl border-2 border-foreground bg-primary p-6 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2.5">
					<div className="flex flex-wrap items-center gap-3">
						<h3 className="text-2xl font-bold tracking-tight text-card-foreground uppercase">
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

            <div className="mt-4 border-t border-muted pt-4">
				<p className="text-base leading-relaxed text-card-foreground/90">
					{explanation.userExplanation}
				</p>
			</div>
		</article>
	);
}
