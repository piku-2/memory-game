"use client";

import Link from "next/link";
import { Difficulty, DIFFICULTY_CONFIG } from "@/lib/constants";

// 各難易度の説明テキスト
const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: "2×2 パネル / 2〜5個の順番",
  normal: "3×3 パネル / 2〜7個の順番",
  hard: "4×4 パネル / 3〜8個の順番",
  master: "5×5 パネル / 5〜9個の順番",
};

// 各難易度のカラー設定
const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-green-600 hover:bg-green-500",
  normal: "bg-blue-600 hover:bg-blue-500",
  hard: "bg-orange-600 hover:bg-orange-500",
  master: "bg-red-600 hover:bg-red-500",
};

export default function DifficultySelector() {
  const difficulties = Object.keys(DIFFICULTY_CONFIG) as Difficulty[];

  return (
    <div className="grid gap-4 w-full max-w-md">
      {difficulties.map((difficulty) => (
        <Link
          key={difficulty}
          href={`/game?difficulty=${difficulty}`}
          className={`
            block p-6 rounded-xl text-white font-bold transition-all
            hover:scale-105 hover:shadow-lg
            ${DIFFICULTY_COLORS[difficulty]}
          `}
        >
          <div className="flex justify-between items-center">
            <span className="text-xl">{DIFFICULTY_CONFIG[difficulty].label}</span>
            <span className="text-sm opacity-80">
              {DIFFICULTY_DESCRIPTIONS[difficulty]}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
