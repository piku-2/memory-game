"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GameBoard from "@/components/GameBoard";
import { Difficulty, DIFFICULTY_CONFIG } from "@/lib/constants";
import Link from "next/link";

function GameContent() {
  const searchParams = useSearchParams();
  const difficultyParam = searchParams.get("difficulty");

  // 不正な難易度パラメータのバリデーション
  const isValidDifficulty = (value: string | null): value is Difficulty => {
    return value !== null && value in DIFFICULTY_CONFIG;
  };

  if (!isValidDifficulty(difficultyParam)) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-xl text-red-400">無効な難易度です</p>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
        >
          トップへ戻る
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-100">
        Memory Game
        <span className="ml-3 text-lg text-gray-400">
          {DIFFICULTY_CONFIG[difficultyParam].label}
        </span>
      </h1>
      <GameBoard difficulty={difficultyParam} />
    </>
  );
}

export default function GamePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <Suspense fallback={<p className="text-gray-400">読み込み中...</p>}>
        <GameContent />
      </Suspense>
    </div>
  );
}
