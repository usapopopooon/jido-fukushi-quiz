import { STUDY_TOPICS } from '@/data/studyTopics';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StudyTopic } from '@/types/quiz';

const SERVICE_BADGE: Record<string, string> = {
  '共通': 'bg-gray-100 text-gray-600',
  '児童発達支援': 'bg-blue-100 text-blue-700',
  '放課後等デイサービス': 'bg-purple-100 text-purple-700',
  '居宅訪問': 'bg-orange-100 text-orange-700',
};

interface Props {
  onSelect: (topic: StudyTopic) => void;
  onBack: () => void;
}

export default function StudyListScreen({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={onBack} className="shrink-0">
            ← 戻る
          </Button>
          <h1 className="text-2xl font-bold text-foreground">学習テキスト</h1>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          各カテゴリの制度・加算について、表や図を交えて詳しく学べます。クイズの前に読んでおくと効果的です。
        </p>

        <div className="space-y-3">
          {STUDY_TOPICS.map((topic) => (
            <Card
              key={topic.id}
              className="cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all"
              onClick={() => onSelect(topic)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-snug">
                      {topic.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${SERVICE_BADGE[topic.serviceType] ?? ''}`}
                      >
                        {topic.serviceType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {topic.sections.length}セクション
                      </span>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm">→</span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
