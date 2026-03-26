# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

パネルが光る順番を覚えて再現する記憶力ゲーム（Simon Says風）。4段階の難易度（2×2〜5×5グリッド）を持ち、ダークテーマ固定のWebアプリケーション。

## 技術スタック

- Next.js 16.2.1（App Router）+ React 19 + TypeScript
- Tailwind CSS v4（`@tailwindcss/postcss`経由）
- ESLint 9（Core Web Vitals + TypeScript ルール）
- パッケージマネージャ: npm

**注意:** Next.js 16 は breaking changes を含む。コード変更前に `node_modules/next/dist/docs/` のガイドを確認すること（AGENTS.md参照）。

## コマンド

```bash
npm run dev        # 開発サーバ起動（localhost:3000）
npm run build      # 本番ビルド
npm start          # 本番サーバ起動
npm run lint       # ESLintチェック
```

## アーキテクチャ

パスエイリアス: `@/*` → `./src/*`

### ゲームロジックの中核

`src/hooks/useGameLogic.ts` がゲーム全体の状態管理を担うカスタムフック。状態遷移は `GamePhase` 型（`idle → showing → input → success/failure`）で制御。全コンポーネントはこのフックを通じてゲーム状態にアクセスする。

### 画面遷移

- `/` — 難易度選択画面（`DifficultySelector`コンポーネント）
- `/game?difficulty=<easy|normal|hard|master>` — ゲーム画面（`GameBoard`コンポーネント）

難易度はURLクエリパラメータで渡す。`game/page.tsx`で`useSearchParams`を`Suspense`でラップ。

### スタイリング方針

- ダークテーマ固定（`<html>`に`dark`クラス、ライトモード非対応）
- パネルの発光エフェクト: インラインstyleの`boxShadow` + Tailwindの`brightness`/`scale`
- カスタムアニメーション: `globals.css`の`@keyframes panel-flash`

## タスク

- TASKS.md を参照。
