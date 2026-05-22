-- CreateTable
CREATE TABLE "Explanation" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "wordType" TEXT,
    "score" INTEGER NOT NULL,
    "userExplanation" TEXT NOT NULL,
    "aiExplanation" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Explanation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Explanation_word_idx" ON "Explanation"("word");
