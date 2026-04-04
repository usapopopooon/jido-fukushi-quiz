import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StudyTopic, StudySection, StudyTable } from '@/types/quiz';

interface Props {
  topic: StudyTopic;
  onBack: () => void;
}

function StudyTableView({ table }: { table: StudyTable }) {
  return (
    <div className="overflow-x-auto my-3 rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 1 ? 'bg-muted/30' : ''}>
              {row.cells.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-muted-foreground border-t border-border">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionView({ section, index }: { section: StudySection; index: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">
          {index + 1}
        </span>
        <h3 className="text-base font-semibold text-foreground">{section.heading}</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed ml-8">
        {section.body}
      </p>

      {section.table && (
        <div className="ml-8">
          <StudyTableView table={section.table} />
        </div>
      )}

      {section.note && (
        <div className="ml-8 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-800">
            <span className="font-bold">💡 ポイント：</span> {section.note}
          </p>
        </div>
      )}
    </div>
  );
}

export default function StudyDetailScreen({ topic, onBack }: Props) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card shadow-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} size="sm" className="shrink-0">
            ← 一覧
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span>{topic.icon}</span>
              <h1 className="text-base font-bold text-foreground truncate">
                {topic.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-700">
          {topic.category}
        </Badge>

        {topic.sections.map((section, i) => (
          <SectionView key={i} section={section} index={i} />
        ))}

        {/* Source */}
        <Card className="mt-8">
          <CardContent className="py-3">
            <p className="text-xs text-muted-foreground">
              出典：
              <a
                href={topic.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {topic.source}
              </a>
            </p>
          </CardContent>
        </Card>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full mt-4 py-3 h-auto"
        >
          ← 一覧に戻る
        </Button>
      </div>
    </div>
  );
}
