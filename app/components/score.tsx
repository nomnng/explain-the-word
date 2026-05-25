type ScoreProps = {
    score: number;
    enlarge?: boolean;
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

export function Score({score, enlarge = true} : ScoreProps) {
    const scoreSize = enlarge ? "text-5xl" : "text-xl";
    const scoreColor = scoreTone(score);

    return (
        <p
            className={`font-semibold tabular-nums`}
        >
            <span className={`${scoreSize} ${scoreColor}`}>
                {score}
            </span>
            <span className="text-xl text-foreground">/100</span>
        </p>
    );    
}