import { WordGame } from "@/app/components/word-game";
import { getRandomWord } from "@/lib/words";

export const dynamic = "force-dynamic";

export default function Home() {
  const initialWord = getRandomWord();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <WordGame initialWord={initialWord} />
    </div>
  );
}
