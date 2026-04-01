import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultScreen from '../ResultScreen';
import type { AnswerResult, Question4, QuestionOX } from '../../types/quiz';

afterEach(cleanup);

const q1: Question4 = {
  type: '4択',
  serviceType: '共通',
  category: '基本報酬',
  difficulty: '初級',
  q: '問題1',
  choices: ['A', 'B', 'C', 'D'],
  answer: 0,
  explanation: '解説1',
};

const q2: QuestionOX = {
  type: '○×',
  serviceType: '児童発達支援',
  category: '家族支援加算',
  difficulty: '中級',
  q: '問題2',
  answer: true,
  explanation: '解説2',
};

const results: AnswerResult[] = [
  { question: q1, correct: true },
  { question: q2, correct: false },
];

describe('ResultScreen', () => {
  it('displays score', () => {
    render(
      <ResultScreen score={1} totalCount={2} results={results} onRestart={vi.fn()} />,
    );
    expect(screen.getAllByText('/ 2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('50%').length).toBeGreaterThanOrEqual(1);
  });

  it('shows appropriate message for 50% score', () => {
    render(
      <ResultScreen score={1} totalCount={2} results={results} onRestart={vi.fn()} />,
    );
    expect(
      screen.getAllByText('基礎は押さえられています。加算要件を中心に復習しましょう。').length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('shows appropriate message for 90%+ score', () => {
    const highResults: AnswerResult[] = Array.from({ length: 10 }, (_, i) => ({
      question: { ...q1, q: `問��${i}` },
      correct: i < 9,
    }));
    render(
      <ResultScreen score={9} totalCount={10} results={highResults} onRestart={vi.fn()} />,
    );
    expect(
      screen.getAllByText('制度・加算への理解が十分にあります。').length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('shows appropriate message for <50% score', () => {
    const lowResults: AnswerResult[] = [
      { question: q1, correct: false },
      { question: q2, correct: false },
    ];
    render(
      <ResultScreen score={0} totalCount={2} results={lowResults} onRestart={vi.fn()} />,
    );
    expect(
      screen.getAllByText('制度の基礎から改めて確認することをおすすめします。').length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('displays category breakdown', () => {
    render(
      <ResultScreen score={1} totalCount={2} results={results} onRestart={vi.fn()} />,
    );
    expect(screen.getAllByText('カテゴリ別正答数').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('基本報酬').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('家族支援加算').length).toBeGreaterThanOrEqual(1);
  });

  it('displays all results with correct/incorrect marks', () => {
    render(
      <ResultScreen score={1} totalCount={2} results={results} onRestart={vi.fn()} />,
    );
    expect(screen.getAllByText('✓').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('✗').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('問題1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('問題2').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onRestart when restart button clicked', async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    render(
      <ResultScreen score={1} totalCount={2} results={results} onRestart={onRestart} />,
    );
    const buttons = screen.getAllByText('もう一度チャレンジ');
    await user.click(buttons[0]);
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
