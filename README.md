# Memory Game

Simon Says 風の記憶力ゲーム。パネルが光る順番を覚えて、同じ順番でクリックしよう。

## 遊び方

1. ゲーム開始するとパネルが順番に光る
2. 光った順番を記憶して、同じ順番でパネルをクリック
3. 正解するとラウンドが進み、1つずつ光る数が増えていく
4. 間違えるとゲームオーバー

## 難易度

| 難易度 | グリッド | 開始光数 | 最大光数 |
|--------|----------|----------|----------|
| Easy   | 2×2      | 2        | 5        |
| Normal | 3×3      | 2        | 7        |
| Hard   | 4×4      | 3        | 8        |
| Master | 5×5      | 5        | 9        |

## 技術スタック

- [Next.js](https://nextjs.org/) 16（App Router）
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- React 19

## セットアップ

```bash
git clone https://github.com/piku-2/memory-game.git
cd memory-game
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

## コマンド

| コマンド        | 説明                        |
|-----------------|-----------------------------|
| `npm run dev`   | 開発サーバー起動            |
| `npm run build` | 本番ビルド                  |
| `npm start`     | 本番サーバー起動            |

## ライセンス

[MIT](LICENSE)
