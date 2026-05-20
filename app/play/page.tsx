import { WordGame } from "./word-game";
import { getRandomWord } from "@/lib/words";

export const dynamic = "force-dynamic";

export default function PlayPage() {
	const initialWord = getRandomWord();

	return (
		<div className="flex min-h-full flex-1 flex-col font-sans">
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-8">
				<header className="space-y-3">
					<h1 className="text-4xl uppercase font-semibold tracking-widest text-center">
						Explain the word
					</h1>
					<p className="text-lg leading-8">
						Describe the word in your own words. An AI judge will score your
						answer out of 100 and share the real definition.
					</p>
				</header>
				<WordGame initialWord={initialWord} />
			</div>

		</div>
	);
}
