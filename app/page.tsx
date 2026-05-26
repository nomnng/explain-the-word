import { getAllExplanations } from "@/lib/db/explanations";
import { ExplanationEntry } from "./components/explanation-entry";
import { Suspense } from "react";
import { LoadingSpinner } from "./components/loading-spinner";

async function RecentExplanaitons() {
	const explanations = await getAllExplanations();

	return (
		<>
			{explanations.length === 0 ? (
				<section className="rounded-3xl border-2 border-foreground bg-primary p-6 shadow-sm">
					<p className="text-foreground/70">No saved words yet.</p>
				</section>
			) : (
				<ul className="flex flex-col gap-6">
					{explanations.map((entry) => (
						<li key={entry.id}>
							<ExplanationEntry explanation={entry} />
						</li>
					))}
				</ul>
			)}
		</>	
	);
}

export default function HomePage() {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16 font-sans">
			<header className="space-y-3">
				<h1 className="text-center text-4xl font-semibold uppercase tracking-widest">
					Recent words
				</h1>
				<p className="text-lg leading-8">
					Recently described words from everyone playing will show up here.
					Saved results are not wired up yet — this page is a placeholder.
				</p>
			</header>

			<Suspense fallback={<LoadingSpinner/>}>
				<RecentExplanaitons/>
			</Suspense>
		</div>
	);
}
