"use client";

import { Score } from "@/app/components/score";

type EvaluationResultProps = {
	score: number;
	explanation: string;
	feedback: string;
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

export function EvaluationResult({ score, explanation, feedback }: EvaluationResultProps) {
	return (
        <section className="rounded-3xl border-2 border-foreground bg-primary p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-md font-light uppercase tracking-widest mb-2">
                        Your score
                    </p>
                    <Score score={score} />
                </div>
            </div>

            <div className="mt-8 space-y-6">
                <div>
                    <h2 className="text-md font-light uppercase tracking-widest">
                        Feedback
                    </h2>
                    <p className="mt-2 text-base leading-7">
                        {feedback}
                    </p>
                </div>

                <div>
                    <h2 className="text-md font-light uppercase tracking-widest">
                        What it means
                    </h2>
                    <p className="mt-2 text-base leading-7">
                        {explanation}
                    </p>
                </div>
            </div>
        </section>
	);
}