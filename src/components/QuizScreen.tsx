import { useState } from 'react';
import type { Question } from '../types/quiz';

interface Props {
  question: Question;
  currentIndex: number;
  totalCount: number;
  answered: boolean;
  isCorrect: boolean | null;
  onAnswer4: (idx: number) => void;
  onAnswerOX: (val: boolean) => void;
  onNext: () => void;
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

  const getChoiceStyle = (idx: number) => {
    if (!answered) {
      return 'bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 active:bg-emerald-100';
    }
    if (question.type === '4択') {
      if (idx === question.answer) {
        return 'bg-green-50 border-green-500 text-green-800';
      }
      if (idx === selectedIdx && idx !== question.answer) {
        return 'bg-red-50 border-red-500 text-red-800';
      }
    }
    return 'bg-gray-50 border-gray-200 text-gray-400';
  };

  const getOXStyle = (val: boolean) => {
    if (!answered) {
      return 'bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50';
    }
    if (question.type === '○×') {
      if (val === question.answer) {
        return 'bg-green-50 border-green-500 text-green-800';
      }
      if (val === selectedOX && val !== question.answer) {
        return 'bg-red-50 border-red-500 text-red-800';
      }
    }
    return 'bg-gray-50 border-gray-200 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress bar */}
      <div className="bg-white shadow-sm">
        <div className="h-1.5 bg-gray-200">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">
            問題 {currentIndex + 1} / {totalCount}
          </span>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              {question.type}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              question.difficulty === '初級' ? 'bg-green-100 text-green-700' :
              question.difficulty === '中級' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              {question.category}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-6">
          {question.q}
        </p>

        {/* 4択 choices */}
        {question.type === '4択' && (
          <div className="space-y-3">
            {question.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer4(idx)}
                disabled={answered}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors flex items-start gap-3 ${getChoiceStyle(idx)}`}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                  {LABELS[idx]}
                </span>
                <span className="text-sm leading-relaxed pt-0.5">{choice}</span>
              </button>
            ))}
          </div>
        )}

        {/* ○× choices */}
        {question.type === '○×' && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswerOX(true)}
              disabled={answered}
              className={`py-8 rounded-xl border-2 text-4xl font-bold transition-colors ${getOXStyle(true)}`}
            >
              ○
            </button>
            <button
              onClick={() => handleAnswerOX(false)}
              disabled={answered}
              className={`py-8 rounded-xl border-2 text-4xl font-bold transition-colors ${getOXStyle(false)}`}
            >
              ×
            </button>
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

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {question.explanation}
              </p>
              {question.source && (
                <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
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
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl text-white font-bold bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              {isLast ? '結果を見る →' : '次の問題 →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
