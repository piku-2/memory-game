"use client";

import { useState, useCallback } from "react";
import { ANIMATION } from "@/lib/constants";

type PanelProps = {
  color: string;        // このパネルの基本色
  isActive: boolean;    // 出題中に光っている状態か
  isClickable: boolean; // クリック受付可能か（inputフェーズのみtrue）
  onClick: () => void;  // クリックハンドラ
};

export default function Panel({ color, isActive, isClickable, onClick }: PanelProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  // パネルクリック時の処理
  const handleClick = useCallback(() => {
    if (!isClickable) return;

    // フラッシュアニメーション開始
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), ANIMATION.flashDuration);

    onClick();
  }, [isClickable, onClick]);

  // パネルが光っている状態かどうか
  const isLit = isActive || isFlashing;

  return (
    <button
      onClick={handleClick}
      disabled={!isClickable}
      className={`
        aspect-square rounded-xl transition-[transform,box-shadow] duration-300 border-2
        ${isClickable ? "cursor-pointer hover:scale-105" : "cursor-default"}
        ${isActive ? "scale-105 brightness-150" : ""}
        ${!isLit ? "brightness-75 hover:brightness-90" : ""}
        ${isFlashing ? "animate-flash" : ""}
      `}
      style={{
        // 通常時はグレー背景、光っているときだけ本来の色を表示
        backgroundColor: isLit ? color : "#374151",
        // 通常時はグレー系ボーダー、光っているときだけ本来の色に変える
        borderColor: isLit ? color : "#4B5563",
        // 発光エフェクトは光っているときのみ
        boxShadow: isLit ? `0 0 25px ${color}, 0 0 50px ${color}40` : "none",
      }}
      aria-label={`パネル`}
    />
  );
}
