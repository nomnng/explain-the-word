import { saveExplanation } from "@/lib/db/explanations";
import { evaluateWordDescription } from "@/lib/groq";
import { NextResponse } from "next/server";

type EvaluateRequestBody = {
	word?: string;
	type?: string;
	description?: string;
};

export async function POST(request: Request) {
	let body: EvaluateRequestBody;

	try {
		body = (await request.json()) as EvaluateRequestBody;
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const word = body.word?.trim();
	const type = body.type?.trim();
	const description = body.description?.trim();

	if (!word) {
		return NextResponse.json({ error: "Word is required" }, { status: 400 });
	}

	if (!description) {
		return NextResponse.json(
			{ error: "Description is required" },
			{ status: 400 },
		);
	}

	if (description.length > 2000) {
		return NextResponse.json(
			{ error: "Description must be 2000 characters or fewer" },
			{ status: 400 },
		);
	}

	try {
		const result = await evaluateWordDescription(word, description, type);

		await saveExplanation({
			word,
			wordType: type,
			score: result.score,
			userExplanation: description,
			aiExplanation: result.explanation,
			feedback: result.feedback,
		});

		return NextResponse.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to evaluate description";

		const status = message.includes("GROQ_API_KEY") ? 503 : 500;

		return NextResponse.json({ error: message }, { status });
	}
}
