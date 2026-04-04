# 児童福祉クイズ

児童発達支援・放課後等デイサービスの報酬改定や加算に関する知識を、クイズ形式で学べる Web アプリです。

## 機能

- **クイズモード** — 4 択問題・○× 問題をランダム出題し、即時フィードバックと解説を表示
- **学習モード** — カテゴリ別にまとめた解説記事を閲覧
- **PWA 対応** — ホーム画面に追加してオフラインでも利用可能

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | React 19 + TypeScript |
| ビルド | Vite |
| スタイリング | Tailwind CSS 4 |
| UI コンポーネント | shadcn/ui |
| テスト | Vitest + Testing Library |
| PWA | vite-plugin-pwa |

## セットアップ

```bash
# 依存インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test
```

## ディレクトリ構成

```
src/
├── components/       # 画面コンポーネント
│   ├── ui/           # 共通 UI (button, card, badge など)
│   └── __tests__/    # コンポーネントテスト
├── data/             # 問題データ・学習トピックデータ
├── hooks/            # カスタムフック (useQuiz, usePWAInstall)
├── types/            # 型定義
└── lib/              # ユーティリティ
```

## ライセンス

Private
