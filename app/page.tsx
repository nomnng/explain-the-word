import Link from "next/link";

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

			<section className="rounded-3xl border-2 border-foreground bg-primary p-6 shadow-sm">
				<p className="text-foreground/70">No saved words yet.</p>
			</section>
		</div>
	);
}
