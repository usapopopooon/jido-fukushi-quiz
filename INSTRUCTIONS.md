# jido-fukushi-quiz 実装指示書（React 19 + PWA）

## 概要

児童福祉サービスの制度・加算を学ぶクイズアプリを実装する。
対象サービスは**児童発達支援・放課後等デイサービス・居宅訪問型児童発達支援**。
対象ユーザーは事業所の新人スタッフ。問題はハードコードで管理する。
スマートフォンからホーム画面に追加してオフラインでも使えるPWAとして構築する。

リポジトリ名: `jido-fukushi-quiz`

---

## 技術スタック

| 項目 | 採用技術 |
|------|----------|
| フレームワーク | React 19 |
| ビルドツール | Vite 6 |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS v4 |
| PWA | vite-plugin-pwa（Workbox） |
| 状態管理 | useState / useReducer のみ（外部ライブラリ不要） |

### React 19 固有の注意点

- `use()` フック、`useActionState()`、`useOptimistic()` などのReact 19新APIを必要に応じて活用してよい
- `forwardRef` は不要になったため使わない（refはpropsとして直接受け取る）
- `ReactDOM.render` は削除済み。`createRoot` を使うこと
- Storybook等を併用する場合、`preview.tsx` でJSXを使う際は `import React from 'react'` を明示する（`react/jsx-dev-runtime` のバンドル設定が必要な場合がある）

---

## ディレクトリ構成

```
├── public/
│   ├── icons/
│   │   ├── icon-192.png       # PWAアイコン 192×192
│   │   └── icon-512.png       # PWAアイコン 512×512
│   └── screenshots/
│       └── screen-quiz.png    # PWAインストールプロンプト用スクリーンショット（任意）
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── data/
│   │   └── questions.ts       # 問題データ（全35問）
│   ├── components/
│   │   ├── StartScreen.tsx
│   │   ├── QuizScreen.tsx
│   │   └── ResultScreen.tsx
│   ├── hooks/
│   │   └── useQuiz.ts
│   └── types/
│       └── quiz.ts
├── vite.config.ts
└── index.html
```

---

## PWA設定

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: '児童福祉 制度クイズ',
        short_name: '制度クイズ',
        description: '児童発達支援・放課後等デイサービス・居宅訪問の制度・加算を学ぶクイズアプリ',
        theme_color: '#1D9E75',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/screen-quiz.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
      },
      workbox: {
        // 全アセットをprecacheしてオフライン動作を保証
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        // SW更新時は即座に新バージョンを適用
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        // 開発時もSWを有効にして動作確認できるようにする
        enabled: true,
      },
    }),
  ],
})
```

### index.html

`<head>` に以下を追加すること：

```html
<meta name="theme-color" content="#1D9E75" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="児童福祉クイズ" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

---

## 型定義（src/types/quiz.ts）

```typescript
export type QuestionType = '4択' | '○×';

export type ServiceType = '児童発達支援' | '放課後等デイサービス' | '居宅訪問' | '共通';

export interface Question4 {
  type: '4択';
  serviceType: ServiceType;
  category: string;
  q: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface QuestionOX {
  type: '○×';
  serviceType: ServiceType;
  category: string;
  q: string;
  answer: boolean; // true = ○, false = ×
  explanation: string;
}

export type Question = Question4 | QuestionOX;

export type Screen = 'start' | 'quiz' | 'result';

export interface AnswerResult {
  question: Question;
  correct: boolean;
}
```

---

## 問題データ仕様（src/data/questions.ts）

以下の形式で全60問を定義する。4択45問・○×15問のミックス。
サービス種別ごとに問題を分けて管理し、`serviceType` フィールドで区別する。

```typescript
import type { Question } from '../types/quiz';

export const ALL_QUESTIONS: Question[] = [
  {
    type: '4択',
    serviceType: '児童発達支援',
    category: '基本報酬',
    q: '2024年度の報酬改定で、児童発達支援の基本報酬体系はどのように変わりましたか？',
    choices: [
      '時間区分から支援の質・内容に基づく体系へ移行',
      '利用定員のみで報酬を決定する方式に変更',
      '障害種別を廃止して一律報酬に変更',
      '月額包括払いから日額払いに変更',
    ],
    answer: 0,
    explanation:
      '2024年度改定では、従来の「時間区分」から「支援の質・内容」を評価する体系へ移行しました。',
  },
  // ...以下同様に60問定義
];
```

### serviceType の値

| 値 | 対象サービス |
|----|------------|
| `'児童発達支援'` | 児童発達支援（未就学児） |
| `'放課後等デイサービス'` | 放課後等デイサービス（就学児） |
| `'居宅訪問'` | 居宅訪問型児童発達支援 |
| `'共通'` | 複数サービスに共通する制度・加算 |

### カテゴリ一覧

**児童発達支援・放課後等デイサービス共通**
- 基本報酬（2024年度改定）
- 専門的支援加算
- 家族支援加算
- 個別サポート加算（Ⅰ・Ⅱ）
- 送迎加算・欠席時対応加算
- 医療連携体制加算
- 関係機関連携加算・訪問支援加算
- インクルージョン推進・5領域
- 児童発達支援管理責任者（児発管）
- 実地指導・記録管理
- 強度行動障害支援者養成研修加算

**児童発達支援固有**
- 児童発達支援センターと事業所の違い
- 保育所等訪問支援との違い

**放課後等デイサービス固有**
- 放デイの基本報酬区分（区分1・区分2）
- 支援プログラムの届出・公表義務
- 学校との連携・放課後の支援

**居宅訪問型児童発達支援固有**
- 対象児童の要件（重症心身障害等）
- 訪問支援員の資格要件
- 在宅支援の記録・計画管理

---

## クイズロジック（src/hooks/useQuiz.ts）

```typescript
import { useReducer, useCallback } from 'react';
import { ALL_QUESTIONS } from '../data/questions';
import type { Question, Screen, AnswerResult } from '../types/quiz';

interface QuizState {
  screen: Screen;
  questions: Question[];
  currentIndex: number;
  score: number;
  results: AnswerResult[];
  answered: boolean;
  isCorrect: boolean | null;
}

type QuizAction =
  | { type: 'START'; selectedServices: ServiceType[] }
  | { type: 'ANSWER'; correct: boolean; question: Question }
  | { type: 'NEXT' };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function shuffleQuestion(q: Question): Question {
  if (q.type !== '4択') return q;
  const indexed = q.choices.map((text, orig) => ({ text, orig }));
  const shuffled = shuffle(indexed);
  return {
    ...q,
    choices: shuffled.map((c) => c.text) as Question4['choices'],
    answer: shuffled.findIndex((c) => c.orig === q.answer) as 0 | 1 | 2 | 3,
  };
}

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START': {
      const filtered = ALL_QUESTIONS.filter(
        (q) =>
          q.serviceType === '共通' ||
          action.selectedServices.includes(q.serviceType),
      );
      return {
        screen: 'quiz',
        questions: shuffle(filtered).map(shuffleQuestion),
        currentIndex: 0,
        score: 0,
        results: [],
        answered: false,
        isCorrect: null,
      };
    }
    case 'ANSWER':
      return {
        ...state,
        answered: true,
        isCorrect: action.correct,
        score: action.correct ? state.score + 1 : state.score,
        results: [...state.results, { question: action.question, correct: action.correct }],
      };
    case 'NEXT': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, screen: 'result', answered: false, isCorrect: null };
      }
      return { ...state, currentIndex: nextIndex, answered: false, isCorrect: null };
    }
    default:
      return state;
  }
}

const initialState: QuizState = {
  screen: 'start',
  questions: [],
  currentIndex: 0,
  score: 0,
  results: [],
  answered: false,
  isCorrect: null,
};

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startQuiz = useCallback(
    (selectedServices: ServiceType[]) =>
      dispatch({ type: 'START', selectedServices }),
    [],
  );

  const answer4 = useCallback(
    (idx: number) => {
      if (state.answered) return;
      const q = state.questions[state.currentIndex];
      if (q.type !== '4択') return;
      dispatch({ type: 'ANSWER', correct: idx === q.answer, question: q });
    },
    [state],
  );

  const answerOX = useCallback(
    (val: boolean) => {
      if (state.answered) return;
      const q = state.questions[state.currentIndex];
      if (q.type !== '○×') return;
      dispatch({ type: 'ANSWER', correct: val === q.answer, question: q });
    },
    [state],
  );

  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT' }), []);

  return {
    screen: state.screen,
    currentQuestion: state.questions[state.currentIndex] ?? null,
    currentIndex: state.currentIndex,
    totalCount: state.questions.length,
    score: state.score,
    results: state.results,
    answered: state.answered,
    isCorrect: state.isCorrect,
    startQuiz,
    answer4,
    answerOX,
    nextQuestion,
  };
}
```

---

## 画面仕様

### スタート画面（StartScreen）

- アプリタイトル（`jido-fukushi-quiz`）
- **サービス種別フィルタ**（複数選択可のトグルボタン）
  - 「すべて」「児童発達支援」「放課後等デイサービス」「居宅訪問」
  - デフォルトは「すべて」選択状態
  - 選択中のサービスに該当する問題数をリアルタイムで表示（例：「42問」）
- 「クイズを始める」ボタン
- PWAインストールバナー（後述）

フィルタで絞り込んだ問題セットで `startQuiz()` を呼び出す。
`'共通'` の問題は常にどのフィルタでも含める。

---

### 問題画面（QuizScreen）

**上部**
- プログレスバー（`currentIndex / totalCount` で幅を計算）
- 問題番号（例：「問題 3 / 35」）
- 問題種別バッジ（「4択」または「○×」）
- カテゴリバッジ

**問題文**
- 大きめのフォントで表示

**回答ボタン**
- 4択：A〜Dのラベル付きボタンを縦並びで4つ
- ○×：「○」「×」ボタンを横並びで2つ（大きめ）

**回答後フィードバック（必須）**

回答後は以下をすべて表示すること：

1. 正解・不正解バナー
   - 正解時：緑背景に「◎ 正解です！」
   - 不正解時：赤背景に「✕ 不正解です」

2. 選択肢ハイライト（4択）
   - 正解の選択肢：緑
   - 選んだ不正解：赤

3. ○×ボタンハイライト
   - 正解ボタン：緑
   - 選んだ不正解ボタン：赤

4. 解説文（バナーの下）

5. 「次の問題 →」ボタン（最後は「結果を見る →」）

---

### 結果画面（ResultScreen）

- スコア大きく表示（例：「28 / 35」）
- スコアに応じたメッセージ
  - 90%以上：「制度・加算への理解が十分にあります。」
  - 70%以上：「よく理解できています。苦手なカテゴリを確認しましょう。」
  - 50%以上：「基礎は押さえられています。加算要件を中心に復習しましょう。」
  - 50%未満：「制度の基礎から改めて確認することをおすすめします。」
- カテゴリ別正答数をグリッドで表示
- 全問の正誤リスト（✓ / ✗ + サービス種別バッジ + 問題文）
- 「もう一度チャレンジ」ボタン

---

## PWAインストールバナー

スタート画面にインストール促進バナーを実装する。

```typescript
// src/hooks/usePWAInstall.ts
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return { isInstallable, install };
}
```

`isInstallable` が `true` のときのみバナーを表示する。
iOS（Safari）は `beforeinstallprompt` が発火しないため、バナーは表示されない。iOS向けには「Safariの共有ボタンから「ホーム画面に追加」でインストールできます」という静的な案内文を別途表示すること（`navigator.userAgent` でiOSを判定）。

---

## オフライン動作の確認方法

1. `vite build` 後に `vite preview` で本番ビルドを起動
2. DevTools → Application → Service Workers でSWが登録されていることを確認
3. Network タブで「Offline」にチェックを入れ、リロードしてもアプリが表示されることを確認

---

## 注意事項

- 問題・選択肢のシャッフルはクイズ開始時（`START` アクション）のみ行う
- 回答済みの問題は再回答不可にする（ボタンを `disabled` にする）
- PWAアイコンは `maskable` 対応の画像を用意すること（重要な要素を中央80%以内に収める）
- `vite-plugin-pwa` の `devOptions.enabled: true` は開発時のみ有効にし、CIでは無効化を検討すること
