// 難易度の型
export type Difficulty = "easy" | "normal" | "hard" | "master";

// 難易度ごとの設定
export type DifficultyConfig = {
  gridSize: number; // グリッドの1辺のサイズ
  startSequenceCount: number; // 開始時の光る数
  maxLightCount: number; // 最大の光る数
  label: string; // 表示名
};

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { gridSize: 2, startSequenceCount: 2, maxLightCount: 5, label: "Easy" },
  normal: { gridSize: 3, startSequenceCount: 2, maxLightCount: 7, label: "Normal" },
  hard: { gridSize: 4, startSequenceCount: 3, maxLightCount: 8, label: "Hard" },
  master: { gridSize: 5, startSequenceCount: 5, maxLightCount: 9, label: "Master" },
};

// パネルの基本色（10色）
export const PANEL_COLORS = [
  "#EF4444", // 赤
  "#3B82F6", // 青
  "#22C55E", // 緑
  "#EAB308", // 黄
  "#A855F7", // 紫
  "#EC4899", // ピンク
  "#F97316", // オレンジ
  "#06B6D4", // シアン
  "#14B8A6", // ティール
  "#6366F1", // インディゴ
];

// ゲームフェーズの型
export type GamePhase = "idle" | "showing" | "input" | "roundClear" | "success" | "failure";

// アニメーション設定
export const ANIMATION = {
  showInterval: 800, // パネルが光る間隔（ms）
  showDuration: 500, // パネルが光る時間（ms）
  flashDuration: 300, // クリック時のフラッシュ時間（ms）
  nextRoundDelay: 1000, // 次ラウンドまでの待機時間（ms）
  roundClearDuration: 1500, // ラウンドクリア演出の表示時間（ms）
};
