"use client";

import { GamePhase } from "@/lib/constants";

type GameStatusProps = {
  phase: GamePhase;
  round: number;
  maxRound: number;
};

export default function GameStatus({ phase, round, maxRound }: GameStatusProps) {
  // フェーズに応じたメッセージを返す
  const getMessage = () => {
    switch (phase) {
      case "idle":
        return "スタートボタンを押してください";
      case "showing":
        return "光る順番を覚えてください...";
      case "input":
        return "同じ順番でパネルをクリック！";
      case "roundClear":
        return "ラウンドクリア！";
      case "success":
        return "🎉 全ラウンドクリア！おめでとう！";
      case "failure":
        return "❌ 残念...順番が違いました";
    }
  };

  return (
    <div className="text-center space-y-2">
      <p className="text-2xl font-bold text-gray-100">{getMessage()}</p>
      {phase !== "idle" && phase !== "success" && phase !== "failure" && (
        <p className="text-lg text-gray-400">
          ラウンド {round + 1} / {maxRound + 1}
        </p>
      )}
    </div>
  );
}
