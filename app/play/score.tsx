"use client";

type ScoreProps = {
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

export function Score({ score, explanation, feedback }: ScoreProps) {

	return (
        <section className="rounded-3xl border-2 border-foreground bg-primary p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-md font-light uppercase tracking-widest">
                        Your score
                    </p>
                    <p
                        className={`mt-2 text-6xl font-semibold tabular-nums ${scoreTone(score)}`}
                    >
                        {score}
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