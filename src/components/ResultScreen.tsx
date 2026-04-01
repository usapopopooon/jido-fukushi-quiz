import type { AnswerResult } from '../types/quiz';

interface Props {
  score: number;
  totalCount: number;
  results: AnswerResult[];
  onRestart: () => void;
}

function getMessage(rate: number): string {
  if (rate >= 0.9) return '制度・加算への理解が十分にあります。';
  if (rate >= 0.7) return 'よく理解できています。苦手なカテゴリを確認しましょう。';
  if (rate >= 0.5) return '基礎は押さえられています。加算要件を中心に復習しましょう。';
  return '制度の基礎から改めて確認することをおすすめします。';
}

function getCategoryStats(results: AnswerResult[]) {
  const map = new Map<string, { correct: number; total: number }>();
  for (const r of results) {
    const key = r.question.category;
    const entry = map.get(key) ?? { correct: 0, total: 0 };
    entry.total++;
    if (r.correct) entry.correct++;
    map.set(key, entry);
  }
  return Array.from(map.entries()).map(([category, stats]) => ({
    category,
    ...stats,
  }));
}

const SERVICE_COLORS: Record<string, string> = {
  '児童発達支援': 'bg-blue-100 text-blue-700',
  '放課後等デイサービス': 'bg-purple-100 text-purple-700',
  '居宅訪問': 'bg-orange-100 text-orange-700',
  '共通': 'bg-gray-100 text-gray-600',
};

export default function ResultScreen({ score, totalCount, results, onRestart }: Props) {
  const rate = totalCount > 0 ? score / totalCount : 0;
  const categoryStats = getCategoryStats(results);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Score */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">あなたのスコア</p>
          <p className="text-5xl font-bold text-emerald-600 mb-1">
            {score} <span className="text-2xl text-gray-400">/ {totalCount}</span>
          </p>
          <p className="text-lg font-medium text-gray-400 mb-4">
            {Math.round(rate * 100)}%
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {getMessage(rate)}
          </p>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            カテゴリ別正答数
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {categoryStats.map((stat) => (
              <div
                key={stat.category}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
              >
                <span className="text-sm text-gray-700 truncate mr-2">
                  {stat.category}
                </span>
                <span
                  className={`text-sm font-bold shrink-0 ${
                    stat.correct === stat.total
                      ? 'text-emerald-600'
                      : stat.correct === 0
                        ? 'text-red-500'
                        : 'text-amber-600'
                  }`}
                >
                  {stat.correct} / {stat.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Question list */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            全問の結果
          </h2>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-3 py-2 rounded-lg bg-gray-50"
              >
                <span
                  className={`shrink-0 mt-0.5 text-lg font-bold ${
                    r.correct ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {r.correct ? '✓' : '✗'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        SERVICE_COLORS[r.question.serviceType] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {r.question.serviceType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-600">
                      {r.question.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {r.question.q}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md"
        >
          もう一度チャレンジ
        </button>
      </div>
    </div>
  );
}
