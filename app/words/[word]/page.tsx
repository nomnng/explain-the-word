import { ExplanationEntry } from "@/app/words/[word]/explanation-entry";
import { getExplanationsForWord } from "@/lib/explanations";
import Link from "next/link";

type WordPageProps = {
	params: Promise<{ word: string }>;
};

export default async function WordPage({ params }: WordPageProps) {
	const { word } = await params;
	const decodedWord = decodeURIComponent(word);
	const explanations = await getExplanationsForWord(decodedWord);

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16 font-sans">
			<header className="space-y-3">
				<p className="text-sm uppercase tracking-widest text-foreground/70">
					Word
				</p>
				<h1 className="text-4xl font-semibold capitalize">{decodedWord}</h1>
				<p className="text-lg leading-8">
					{explanations.length === 0
						? "No one has described this word yet. Be the first on the play page."
						: `${explanations.length} ${explanations.length === 1 ? "submission" : "submissions"} from players.`}
				</p>
			</header>

			{explanations.length === 0 ? (
				<section className="rounded-3xl border-2 border-foreground bg-primary p-8 shadow-sm">
					<p className="text-foreground/70">No submissions yet.</p>
					<p className="mt-4">
						<Link
							href="/play"
							className="underline underline-offset-4 hover:opacity-80"
						>
							Play and describe this word
						</Link>
					</p>
				</section>
			) : (
				<ul className="flex flex-col gap-6">
					{explanations.map((entry) => (
						<li key={entry.id}>
							<ExplanationEntry
								score={entry.score}
								userExplanation={entry.userExplanation}
								feedback={entry.feedback}
								aiExplanation={entry.aiExplanation}
								createdAt={entry.createdAt}
								wordType={entry.wordType}
							/>
						</li>
					))}
				</ul>
			)}

			<p className="text-center text-sm">
				<Link href="/" className="underline underline-offset-4 hover:opacity-80">
					Back to recent words
				</Link>
			</p>
		</div>
	);
}
