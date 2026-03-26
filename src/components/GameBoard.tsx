"use client";

import { useGameLogic } from "@/hooks/useGameLogic";
import { Difficulty } from "@/lib/constants";
import Panel from "./Panel";
import GameStatus from "./GameStatus";
import Link from "next/link";

type GameBoardProps = {
  difficulty: Difficulty;
};

export default function GameBoard({ difficulty }: GameBoardProps) {
  const {
    phase,
    round,
    maxRound,
    activePanel,
    panelColors,
    config,
    startGame,
    handlePanelClick,
    resetGame,
  } = useGameLogic(difficulty);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* ラウンドクリア演出オーバーレイ */}
      {phase === "roundClear" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* クラッカーパーティクル（紙吹雪） */}
          {Array.from({ length: 30 }).map((_, i) => {
            const colors = ["#EF4444", "#3B82F6", "#22C55E", "#EAB308", "#A855F7", "#EC4899", "#F97316", "#06B6D4"];
            const color = colors[i % colors.length];
            const x = (Math.random() - 0.5) * 400;
            const y = (Math.random() - 0.5) * 400;
            const rotate = Math.random() * 720 - 360;
            const delay = Math.random() * 0.3;
            const size = Math.random() * 8 + 4;
            const shapes = ["rounded-full", "rounded-sm", "rounded-none"];
            const shape = shapes[i % shapes.length];
            return (
              <div
                key={i}
                className={`absolute ${shape} animate-confetti`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  // @ts-expect-error CSS custom properties
                  "--confetti-x": `${x}px`,
                  "--confetti-y": `${y}px`,
                  "--confetti-rotate": `${rotate}deg`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
          {/* ラウンドクリアテキスト */}
          <div className="animate-round-clear text-center">
            <p className="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              🎉 Round {round + 1} Clear!
            </p>
            <p className="text-xl text-gray-300 mt-3">
              Next: Round {round + 2}
            </p>
          </div>
        </div>
      )}

      {/* ステータス表示 */}
      <GameStatus phase={phase} round={round} maxRound={maxRound} />

      {/* パネルグリッド */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`,
          width: `${config.gridSize * 80 + (config.gridSize - 1) * 12}px`,
          maxWidth: "90vw",
        }}
      >
        {panelColors.map((color, index) => (
          <Panel
            key={index}
            color={color}
            isActive={activePanel === index || phase === "roundClear"}
            isClickable={phase === "input"}
            onClick={() => handlePanelClick(index)}
          />
        ))}
      </div>

      {/* idle時のみパネルサイズのプレースホルダーを表示 */}
      {phase === "idle" && (
        <div
          className="grid gap-3 opacity-30"
          style={{
            gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`,
            width: `${config.gridSize * 80 + (config.gridSize - 1) * 12}px`,
            maxWidth: "90vw",
          }}
        >
          {Array.from({ length: config.gridSize * config.gridSize }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gray-800 border-2 border-gray-700"
            />
          ))}
        </div>
      )}

      {/* 操作ボタン */}
      <div className="flex gap-4">
        {phase === "idle" && (
          <button
            onClick={startGame}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-lg"
          >
            スタート
          </button>
        )}

        {(phase === "success" || phase === "failure") && (
          <>
            <button
              onClick={() => {
                resetGame();
                // リセット後に自動でスタート
                setTimeout(() => startGame(), 100);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
            >
              {phase === "failure" ? "リトライ" : "もう一度"}
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
            >
              難易度選択へ
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
