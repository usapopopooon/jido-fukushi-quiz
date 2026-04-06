import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Question } from '@/types/quiz';

interface Props {
  question: Question;
  currentIndex: number;
  totalCount: number;
  answered: boolean;
  isCorrect: boolean | null;
  onAnswer4: (idx: number) => void;
  onAnswerOX: (val: boolean) => void;
  onNext: () => void;
  onQuit: () => void;
}

const LABELS = ['A', 'B', 'C', 'D'] as const;

export default function QuizScreen({
  question,
  currentIndex,
  totalCount,
  answered,
  isCorrect,
  onAnswer4,
  onAnswerOX,
  onNext,
  onQuit,
}: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedOX, setSelectedOX] = useState<boolean | null>(null);
  const progress = ((currentIndex + 1) / totalCount) * 100;
  const isLast = currentIndex === totalCount - 1;

  const handleAnswer4 = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    onAnswer4(idx);
  };

  const handleAnswerOX = (val: boolean) => {
    if (answered) return;
    setSelectedOX(val);
    onAnswerOX(val);
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setSelectedOX(null);
    onNext();
  };

  const handleQuit = () => {
    if (window.confirm('クイズを中断してトップに戻ります。現在の進行状況は破棄されますがよろしいですか？')) {
      setSelectedIdx(null);
      setSelectedOX(null);
      onQuit();
    }
  };

  const getChoiceExtraClass = (idx: number) => {
    if (!answered) return 'hover:border-emerald-400 hover:bg-emerald-50';
    if (question.type === '4択') {
      if (idx === question.answer) return 'bg-green-100 border-green-500 text-green-800';
      if (idx === selectedIdx && idx !== question.answer) return 'bg-red-100 border-red-500 text-red-800';
    }
    return 'opacity-50';
  };

  const getOXExtraClass = (val: boolean) => {
    if (!answered) return 'hover:border-emerald-400 hover:bg-emerald-50';
    if (question.type === '○×') {
      if (val === question.answer) return 'bg-green-100 border-green-500 text-green-800';
      if (val === selectedOX && val !== question.answer) return 'bg-red-100 border-red-500 text-red-800';
    }
    return 'opacity-50';
  };

  const difficultyColor =
    question.difficulty === '初級' ? 'bg-green-100 text-green-700' :
    question.difficulty === '中級' ? 'bg-yellow-100 text-yellow-700' :
    'bg-red-100 text-red-700';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress */}
      <div className="bg-card shadow-sm">
        <Progress value={progress} className="[&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:rounded-none [&_[data-slot=progress-indicator]]:bg-emerald-500" />
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground font-medium">
            問題 {currentIndex + 1} / {totalCount}
          </span>
          <div className="flex gap-2 flex-wrap items-center">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {question.type}
            </Badge>
            <Badge variant="secondary" className={difficultyColor}>
              {question.difficulty}
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {question.category}
            </Badge>
            <Button
              onClick={handleQuit}
              variant="ghost"
              size="icon"
              aria-label="クイズを中断"
              className="h-7 w-7 text-muted-foreground hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <p className="text-lg font-semibold text-foreground leading-relaxed mb-6">
          {question.q}
        </p>

        {/* 4択 choices */}
        {question.type === '4択' && (
          <div className="space-y-3">
            {question.choices.map((choice, idx) => (
              <Button
                key={idx}
                onClick={() => handleAnswer4(idx)}
                disabled={answered}
                variant="outline"
                className={`w-full text-left h-auto px-4 py-3 rounded-xl border-2 flex items-start gap-3 justify-start ${getChoiceExtraClass(idx)}`}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                  {LABELS[idx]}
                </span>
                <span className="text-sm leading-relaxed pt-0.5 whitespace-normal text-left">{choice}</span>
              </Button>
            ))}
          </div>
        )}

        {/* ○× choices */}
        {question.type === '○×' && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleAnswerOX(true)}
              disabled={answered}
              variant="outline"
              className={`h-auto py-8 rounded-xl border-2 text-4xl font-bold ${getOXExtraClass(true)}`}
            >
              ○
            </Button>
            <Button
              onClick={() => handleAnswerOX(false)}
              disabled={answered}
              variant="outline"
              className={`h-auto py-8 rounded-xl border-2 text-4xl font-bold ${getOXExtraClass(false)}`}
            >
              ×
            </Button>
          </div>
        )}

        {/* Feedback */}
        {answered && (
          <div className="mt-6 space-y-4">
            <div
              className={`px-4 py-3 rounded-xl text-center font-bold text-lg ${
                isCorrect
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isCorrect ? '◎ 正解です！' : '✕ 不正解です'}
            </div>

            <Card>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
                {question.source && (
                  <p className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground/60">
                    出典：
                    {question.sourceUrl ? (
                      <a
                        href={question.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        {question.source}
                      </a>
                    ) : (
                      <span>{question.source}</span>
                    )}
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleNext}
              className="w-full py-3 h-auto rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLast ? '結果を見る →' : '次の問題 →'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
