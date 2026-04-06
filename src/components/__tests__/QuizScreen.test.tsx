import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizScreen from '../QuizScreen';
import type { Question4, QuestionOX } from '../../types/quiz';

afterEach(cleanup);

const question4: Question4 = {
  type: '4択',
  serviceType: '共通',
  category: '基本報酬',
  difficulty: '中級',
  q: 'テスト問題です。',
  choices: ['選択肢A', '選択肢B', '選択肢C', '選択肢D'],
  answer: 1,
  explanation: 'Bが正解です。',
  source: '令和6年度報酬改定概要',
  sourceUrl: 'https://www.mhlw.go.jp/content/12401000/001205270.pdf',
};

const questionOX: QuestionOX = {
  type: '○×',
  serviceType: '児童発達支援',
  category: '基本報酬',
  difficulty: '初級',
  q: '○×テスト問題です。',
  answer: true,
  explanation: '○が正解です。',
};

const baseProps = {
  currentIndex: 0,
  totalCount: 10,
  answered: false,
  isCorrect: null,
  onAnswer4: vi.fn(),
  onAnswerOX: vi.fn(),
  onNext: vi.fn(),
  onQuit: vi.fn(),
};

describe('QuizScreen - 4択', () => {
  it('renders question text and choices', () => {
    render(<QuizScreen {...baseProps} question={question4} />);
    expect(screen.getAllByText('テスト問題です。').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('選択肢A').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('選択肢B').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('選択肢C').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('選択肢D').length).toBeGreaterThanOrEqual(1);
  });

  it('shows progress info', () => {
    render(<QuizScreen {...baseProps} question={question4} />);
    expect(screen.getAllByText('問題 1 / 10').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('4択').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('基本報酬').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onAnswer4 when a choice is clicked', async () => {
    const user = userEvent.setup();
    const onAnswer4 = vi.fn();
    render(<QuizScreen {...baseProps} question={question4} onAnswer4={onAnswer4} />);
    const buttons = screen.getAllByText('選択肢C');
    await user.click(buttons[0]);
    expect(onAnswer4).toHaveBeenCalledWith(2);
  });

  it('shows correct feedback after answering correctly', () => {
    render(
      <QuizScreen {...baseProps} question={question4} answered={true} isCorrect={true} />,
    );
    expect(screen.getAllByText('◎ 正解です！').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Bが正解です。').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('次の問題 →').length).toBeGreaterThanOrEqual(1);
  });

  it('shows incorrect feedback after answering wrong', () => {
    render(
      <QuizScreen {...baseProps} question={question4} answered={true} isCorrect={false} />,
    );
    expect(screen.getAllByText('✕ 不正解です').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Bが正解です。').length).toBeGreaterThanOrEqual(1);
  });

  it('shows "結果を見る" on the last question', () => {
    render(
      <QuizScreen
        {...baseProps}
        question={question4}
        currentIndex={9}
        totalCount={10}
        answered={true}
        isCorrect={true}
      />,
    );
    expect(screen.getAllByText('結果を見る →').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(
      <QuizScreen
        {...baseProps}
        question={question4}
        answered={true}
        isCorrect={true}
        onNext={onNext}
      />,
    );
    const buttons = screen.getAllByText('次の問題 →');
    await user.click(buttons[0]);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('shows difficulty badge', () => {
    render(<QuizScreen {...baseProps} question={question4} />);
    expect(screen.getAllByText('中級').length).toBeGreaterThanOrEqual(1);
  });

  it('shows source link in feedback', () => {
    render(
      <QuizScreen {...baseProps} question={question4} answered={true} isCorrect={true} />,
    );
    const links = screen.getAllByText('令和6年度報酬改定概要');
    expect(links.length).toBeGreaterThanOrEqual(1);
    const link = links[0].closest('a');
    expect(link).toHaveAttribute('href', 'https://www.mhlw.go.jp/content/12401000/001205270.pdf');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('does not show source when not provided', () => {
    const noSourceQ: Question4 = { ...question4, source: undefined, sourceUrl: undefined };
    render(
      <QuizScreen {...baseProps} question={noSourceQ} answered={true} isCorrect={true} />,
    );
    expect(screen.queryAllByText(/出典/)).toHaveLength(0);
  });

  it('disables choice buttons after answering', () => {
    render(
      <QuizScreen {...baseProps} question={question4} answered={true} isCorrect={true} />,
    );
    const allButtons = screen.getAllByRole('button');
    const choiceButtons = allButtons.filter((b) =>
      ['選択肢A', '選択肢B', '選択肢C', '選択肢D'].some((t) => b.textContent?.includes(t)),
    );
    expect(choiceButtons.length).toBeGreaterThanOrEqual(4);
    choiceButtons.forEach((btn) => expect(btn).toBeDisabled());
  });
});

describe('QuizScreen - ○×', () => {
  it('renders ○ and × buttons', () => {
    render(<QuizScreen {...baseProps} question={questionOX} />);
    expect(screen.getAllByText('○').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('×').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onAnswerOX when ○ is clicked', async () => {
    const user = userEvent.setup();
    const onAnswerOX = vi.fn();
    render(<QuizScreen {...baseProps} question={questionOX} onAnswerOX={onAnswerOX} />);
    const buttons = screen.getAllByText('○');
    await user.click(buttons[0]);
    expect(onAnswerOX).toHaveBeenCalledWith(true);
  });

  it('calls onAnswerOX when × is clicked', async () => {
    const user = userEvent.setup();
    const onAnswerOX = vi.fn();
    render(<QuizScreen {...baseProps} question={questionOX} onAnswerOX={onAnswerOX} />);
    const buttons = screen.getAllByText('×');
    await user.click(buttons[0]);
    expect(onAnswerOX).toHaveBeenCalledWith(false);
  });

  it('shows feedback after answering ○×', () => {
    render(
      <QuizScreen {...baseProps} question={questionOX} answered={true} isCorrect={true} />,
    );
    expect(screen.getAllByText('◎ 正解です！').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('○が正解です。').length).toBeGreaterThanOrEqual(1);
  });
});
