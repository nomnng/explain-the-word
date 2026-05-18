import { WordGame } from "@/app/components/word-game";
import { getRandomWord } from "@/lib/words";

export const dynamic = "force-dynamic";

export default function Home() {
  const initialWord = getRandomWord();

  return (
    <div className="flex min-h-full flex-1 flex-col font-sans">
      <WordGame initialWord={initialWord} />
    </div>
  );
}
