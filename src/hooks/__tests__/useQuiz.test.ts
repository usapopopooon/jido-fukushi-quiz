import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../useQuiz';
import type { Difficulty } from '../../types/quiz';

const ALL_DIFFICULTIES: Difficulty[] = ['初級', '中級', '上級'];

describe('useQuiz', () => {
  it('starts with screen "start"', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.screen).toBe('start');
    expect(result.current.currentQuestion).toBeNull();
  });

  it('transitions to quiz screen on startQuiz', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.startQuiz(
        ['児童発達支援', '放課後等デイサービス', '居宅訪問'],
        ALL_DIFFICULTIES,
      );
    });
    expect(result.current.screen).toBe('quiz');
    expect(result.current.currentQuestion).not.toBeNull();
    expect(result.current.totalCount).toBeGreaterThan(0);
    expect(result.current.currentIndex).toBe(0);
  });

  it('filters questions by selected services (always includes 共通)', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.startQuiz(['居宅訪問'], ALL_DIFFICULTIES);
    });
    expect(result.current.totalCount).toBeGreaterThan(0);
    expect(result.current.totalCount).toBeLessThan(119);
  });

  it('filters questions by difficulty', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.startQuiz(
        ['児童発達支援', '放課後等デイサービス', '居宅訪問'],
        ['初級'],
      );
    });
    expect(result.current.totalCount).toBeGreaterThan(0);
    expect(result.current.totalCount).toBeLessThan(119);
  });

  it('filters by both service and difficulty', () => {
    const { result: resultAll } = renderHook(() => useQuiz());
    act(() => {
      resultAll.current.startQuiz(['居宅訪問'], ALL_DIFFICULTIES);
    });
    const countAll = resultAll.current.totalCount;

    const { result: resultFiltered } = renderHook(() => useQuiz());
    act(() => {
      resultFiltered.current.startQuiz(['居宅訪問'], ['上級']);
    });
    expect(resultFiltered.current.totalCount).toBeLessThan(countAll);
  });

  it('records correct answer for 4択', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.startQuiz(
        ['児童発達支援', '放課後等デイサービス', '居宅訪問'],
        ALL_DIFFICULTIES,
      );
    });

    // Skip ○× questions to find a 4択
    while (
      result.current.currentQuestion?.type === '○×' &&
      result.current.currentIndex < result.current.totalCount - 1
    ) {
      act(() => result.current.answerOX(true));
      act(() => result.current.nextQuestion());
    }

    if (result.current.currentQuestion?.type === '4択') {
      const correctIdx = result.current.currentQuestion.answer;
      act(() => result.current.answer4(correctIdx));
      expect(result.current.answered).toBe(true);
      expect(result.current.isCorrect).toBe(true);
    }
  });

  it('records incorrect answer for 4択', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.startQuiz(
        ['児童発達支援', '放課後等デイサービス', '居宅訪問'],
        ALL_DIFFICULTIES,
      );
    });

    while (
      result.current.currentQuestion?.type === '○×' &&
      result.current.currentIndex < result.current.totalCount - 1
    ) {
      act(() => result.current.answerOX(true));
      act(() => result.current.nextQuestion());
    }

    if (result.current.currentQuestion?.type === '4択') {
      const correctIdx = result.current.currentQuestion.answer;
      const wrongIdx = (correctIdx + 1) % 4;
      act(() => result.current.answer4(wrongIdx));
      expect(result.current.answered).toBe(true);
      expect(result.current.isCorrect).toBe(false);
    }
  });

  it('prevents double-answering', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.startQuiz(
        ['児童発達支援', '放課後等デイサービス', '居宅訪問'],
        ALL_DIFFICULTIES,
      );
    });

    while (
      result.current.currentQuestion?.type === '○×' &&
      result.current.currentIndex < result.current.totalCount - 1
    ) {
      act(() => result.current.answerOX(true));
      act(() => result.current.nextQuestion());
    }

    if (result.current.currentQuestion?.type === '4択') {
      const correctIdx = result.current.currentQuestion.answer;
      act(() => result.current.answer4(correctIdx));
      const scoreBefore = result.current.score;
      act(() => result.current.answer4(correctIdx));
      expect(result.current.score).toBe(scoreBefore);
    }
  });

  it('advances to next question on nextQuestion()', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.startQuiz(
        ['児童発達支援', '放課後等デイサービス', '居宅訪問'],
        ALL_DIFFICULTIES,
      );
    });

    const q = result.current.currentQuestion!;
    if (q.type === '4択') {
      act(() => result.current.answer4(q.answer));
    } else {
      act(() => result.current.answerOX(q.answer as boolean));
    }

    act(() => result.current.nextQuestion());
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.answered).toBe(false);
    expect(result.current.isCorrect).toBeNull();
  });

  it('transitions to result screen after last question', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.startQuiz(
        ['児童発達支援', '放課後等デイサービス', '居宅訪問'],
        ALL_DIFFICULTIES,
      );
    });

    const total = result.current.totalCount;
    for (let i = 0; i < total; i++) {
      const q = result.current.currentQuestion!;
      if (q.type === '4択') {
        act(() => result.current.answer4(0));
      } else {
        act(() => result.current.answerOX(true));
      }
      act(() => result.current.nextQuestion());
    }

    expect(result.current.screen).toBe('result');
    expect(result.current.results).toHaveLength(total);
  });
});
