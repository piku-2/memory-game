"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Difficulty,
  GamePhase,
  DIFFICULTY_CONFIG,
  PANEL_COLORS,
  ANIMATION,
} from "@/lib/constants";

/**
 * 配列をシャッフルするユーティリティ（Fisher-Yatesアルゴリズム）
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * ゲームの全状態管理とロジックを担当するカスタムフック
 *
 * @param difficulty - 選択された難易度
 * @returns ゲーム状態と操作関数一式
 */
export function useGameLogic(difficulty: Difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  // グリッド全体のパネル数（例: 4x4 = 16枚）
  const totalPanels = config.gridSize * config.gridSize;

  // 最大ラウンド数（0始まり）
  // startSequenceCount枚から始まり、maxLightCount枚になるまでのラウンド数
  const maxRound = config.maxLightCount - config.startSequenceCount;

  // ゲームのフェーズ状態
  const [phase, setPhase] = useState<GamePhase>("idle");
  // 現在のラウンド数（0始まり）
  const [round, setRound] = useState(0);
  // 正解のパネル点灯シーケンス（パネルインデックスの配列）
  const [sequence, setSequence] = useState<number[]>([]);
  // プレイヤーがクリックしたパネルの入力履歴
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  // 現在点灯中のパネルインデックス（nullは消灯状態）
  const [activePanel, setActivePanel] = useState<number | null>(null);
  // 各パネルに割り当てられた色の配列
  const [panelColors, setPanelColors] = useState<string[]>([]);

  // タイマーIDを保持するref（クリーンアップ用）
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // 最新のround値をrefで保持（setTimeout内でのstale closure対策）
  const roundRef = useRef(round);
  roundRef.current = round;

  /**
   * 登録済みの全タイマーをクリア
   */
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // コンポーネントのアンマウント時にタイマーをクリアしてメモリリークを防ぐ
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  /**
   * パネル色をシャッフルして割り当てる
   * パネル数が色数を超える場合は色を繰り返して使用する
   */
  const generatePanelColors = useCallback(() => {
    const shuffled = shuffleArray(PANEL_COLORS);
    const colors: string[] = [];
    for (let i = 0; i < totalPanels; i++) {
      colors.push(shuffled[i % shuffled.length]);
    }
    return colors;
  }, [totalPanels]);

  /**
   * 指定された長さのランダムなシーケンスを新規生成する
   * 毎ラウンド完全にランダムな配列を作るために使用する
   */
  const generateSequence = useCallback(
    (length: number): number[] => {
      const seq: number[] = [];
      for (let i = 0; i < length; i++) {
        seq.push(Math.floor(Math.random() * totalPanels));
      }
      return seq;
    },
    [totalPanels]
  );

  /**
   * シーケンスを順番に点灯させてプレイヤーに提示する
   * 点灯 → 消灯 を繰り返し、全部終わったら入力フェーズへ移行する
   */
  const showSequence = useCallback((seq: number[]) => {
    setPhase("showing");
    setActivePanel(null);

    seq.forEach((panelIndex, i) => {
      // i番目のパネルを点灯させる
      const showTimer = setTimeout(() => {
        setActivePanel(panelIndex);
      }, i * ANIMATION.showInterval);
      timersRef.current.push(showTimer);

      // showDuration後にパネルを消灯する
      const hideTimer = setTimeout(() => {
        setActivePanel(null);
      }, i * ANIMATION.showInterval + ANIMATION.showDuration);
      timersRef.current.push(hideTimer);
    });

    // 全パネルの点灯が完了したら入力フェーズへ移行する
    const inputTimer = setTimeout(() => {
      setActivePanel(null);
      setPhase("input");
    }, seq.length * ANIMATION.showInterval + 300);
    timersRef.current.push(inputTimer);
  }, []);

  /**
   * ゲームを開始する
   * パネル色を生成し、初期シーケンスを作成して提示する
   */
  const startGame = useCallback(() => {
    clearAllTimers();
    const colors = generatePanelColors();
    setPanelColors(colors);
    setRound(0);
    setPlayerInput([]);

    // 開始時のシーケンス長でランダムシーケンスを新規生成する
    const initialSeq = generateSequence(config.startSequenceCount);
    setSequence(initialSeq);

    // 少し待ってからシーケンスを表示する（視覚的な余白を確保）
    const startTimer = setTimeout(() => {
      showSequence(initialSeq);
    }, 500);
    timersRef.current.push(startTimer);
  }, [clearAllTimers, generatePanelColors, generateSequence, config.startSequenceCount, showSequence]);

  /**
   * パネルクリック時の入力判定処理
   * 正解なら次のステップへ、不正解ならfailureフェーズへ移行する
   */
  const handlePanelClick = useCallback(
    (panelIndex: number) => {
      // 入力フェーズ以外はクリックを無視する
      if (phase !== "input") return;

      const nextInput = [...playerInput, panelIndex];
      const currentStep = nextInput.length - 1;

      // 不正解の場合はfailureフェーズへ移行
      if (nextInput[currentStep] !== sequence[currentStep]) {
        setPhase("failure");
        return;
      }

      setPlayerInput(nextInput);

      // シーケンス全体の入力が完了した場合
      if (nextInput.length === sequence.length) {
        if (roundRef.current >= maxRound) {
          // 最終ラウンドをクリアしたのでsuccessフェーズへ移行
          setPhase("success");
        } else {
          // ラウンドクリア演出を表示（ポーズ状態）
          setPhase("roundClear");

          // 演出終了後にパネルを全消灯し、間を置いてから次ラウンドへ
          const nextTimer = setTimeout(() => {
            const currentRound = roundRef.current;
            const nextRound = currentRound + 1;
            setRound(nextRound);
            setPlayerInput([]);
            const nextSeq = generateSequence(config.startSequenceCount + nextRound);
            setSequence(nextSeq);

            // パネルを全消灯状態にする
            setPhase("showing");
            setActivePanel(null);

            // 消灯状態を1秒見せてから次のシーケンスを提示する
            const showTimer = setTimeout(() => {
              showSequence(nextSeq);
            }, 1000);
            timersRef.current.push(showTimer);
          }, ANIMATION.roundClearDuration);
          timersRef.current.push(nextTimer);
        }
      }
    },
    [phase, playerInput, sequence, maxRound, generateSequence, config.startSequenceCount, showSequence]
  );

  /**
   * ゲームをリセットしてidle状態に戻す
   */
  const resetGame = useCallback(() => {
    clearAllTimers();
    setPhase("idle");
    setRound(0);
    setSequence([]);
    setPlayerInput([]);
    setActivePanel(null);
    setPanelColors([]);
  }, [clearAllTimers]);

  return {
    phase,
    round,
    maxRound,
    sequence,
    playerInput,
    activePanel,
    panelColors,
    config,
    startGame,
    handlePanelClick,
    resetGame,
  };
}
