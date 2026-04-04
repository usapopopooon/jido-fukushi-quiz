import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnswerResult } from '@/types/quiz';

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

const SERVICE_BADGE_CLASS: Record<string, string> = {
  '児童発達支援': 'bg-blue-100 text-blue-700',
  '放課後等デイサービス': 'bg-purple-100 text-purple-700',
  '居宅訪問': 'bg-orange-100 text-orange-700',
  '共通': 'bg-muted text-muted-foreground',
};

export default function ResultScreen({ score, totalCount, results, onRestart }: Props) {
  const rate = totalCount > 0 ? score / totalCount : 0;
  const categoryStats = getCategoryStats(results);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Score */}
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">あなたのスコア</p>
            <p className="text-5xl font-bold text-emerald-600 mb-1">
              {score} <span className="text-2xl text-muted-foreground">/ {totalCount}</span>
            </p>
            <p className="text-lg font-medium text-muted-foreground mb-4">
              {Math.round(rate * 100)}%
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {getMessage(rate)}
            </p>
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>カテゴリ別正答数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {categoryStats.map((stat) => (
                <div
                  key={stat.category}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted"
                >
                  <span className="text-sm text-foreground truncate mr-2">
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
          </CardContent>
        </Card>

        {/* Question list */}
        <Card>
          <CardHeader>
            <CardTitle>全問の結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3 py-2 rounded-lg bg-muted"
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
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${SERVICE_BADGE_CLASS[r.question.serviceType] ?? ''}`}
                      >
                        {r.question.serviceType}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-600">
                        {r.question.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {r.question.q}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Restart */}
        <Button
          onClick={onRestart}
          size="lg"
          className="w-full py-6 rounded-2xl text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          もう一度チャレンジ
        </Button>
      </div>
    </div>
  );
}
