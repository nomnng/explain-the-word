export type EvaluationResult = {
	score: number;
	explanation: string;
	feedback: string;
};

type GroqEvaluationPayload = {
	score?: unknown;
	explanation?: unknown;
	feedback?: unknown;
};

function clampScore(value: unknown): number {
	const numeric = typeof value === "number" ? value : Number(value);

	if (!Number.isFinite(numeric)) {
		return 0;
	}

	return Math.min(100, Math.max(0, Math.round(numeric)));
}

function parseEvaluation(content: string): EvaluationResult {
	let payload: GroqEvaluationPayload;

	try {
		payload = JSON.parse(content) as GroqEvaluationPayload;
	} catch {
		throw new Error("Groq returned invalid JSON");
	}

	const explanation =
		typeof payload.explanation === "string" ? payload.explanation.trim() : "";
	const feedback =
		typeof payload.feedback === "string" ? payload.feedback.trim() : "";

	if (!explanation) {
		throw new Error("Groq response missing explanation");
	}

	return {
		score: clampScore(payload.score),
		explanation,
		feedback: feedback || "No additional feedback provided.",
	};
}

export async function evaluateWordDescription(
	word: string,
	userDescription: string,
	type?: string,
): Promise<EvaluationResult> {
	const apiKey = process.env.GROQ_API_KEY;

	if (!apiKey) {
		throw new Error("GROQ_API_KEY is not configured");
	}

	const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "llama-3.1-8b-instant",
			temperature: 0.2,
			response_format: { type: "json_object" },
			messages: [
				{
					role: "system",
					content: `You grade how well someone explained the meaning of an English word. You will refer to user as "You".
When a part of speech is provided, evaluate the user's description for that specific sense of the word (e.g. "run" as a verb vs noun).
Respond with JSON only, using this exact shape:
{
	"score": <integer from 0 to 100>,
	"explanation": "<clear, accurate definition of the word in the given part of speech>",
	"feedback": "<2-3 sentences evaluating the user's description: what they got right, what they missed, and any misconceptions>"
}
Scoring guide:
- 90-100: excellent, captures core meaning and important nuance
- 70-89: good, mostly correct with minor gaps
- 50-69: partial understanding
- 25-49: weak or significantly incomplete
- 0-24: incorrect, unrelated, or empty reasoning
Be fair, concise, and strict about factual accuracy.`,
				},
				{
					role: "user",
					content: type
						? `Word: ${word}\nPart of speech: ${type}\nUser's description:\n${userDescription}`
						: `Word: ${word}\nUser's description:\n${userDescription}`,
				},
			],
		}),
	});

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`Groq API error (${response.status}): ${errorBody}`);
	}

	const data = (await response.json()) as {
		choices?: Array<{ message?: { content?: string } }>;
	};

	const content = data.choices?.[0]?.message?.content;

	if (!content) {
		throw new Error("Groq returned an empty response");
	}

	return parseEvaluation(content);
}
