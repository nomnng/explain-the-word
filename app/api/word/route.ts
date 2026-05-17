import { getRandomWord } from "@/lib/words";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const word = getRandomWord();
    return NextResponse.json({ word });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load a word";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
