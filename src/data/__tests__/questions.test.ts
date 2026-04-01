import { describe, it, expect } from 'vitest';
import { ALL_QUESTIONS } from '../questions';

describe('questions data', () => {
  it('has exactly 100 questions', () => {
    expect(ALL_QUESTIONS).toHaveLength(100);
  });

  it('has 75 4択 questions and 25 ○× questions', () => {
    const q4 = ALL_QUESTIONS.filter((q) => q.type === '4択');
    const ox = ALL_QUESTIONS.filter((q) => q.type === '○×');
    expect(q4).toHaveLength(75);
    expect(ox).toHaveLength(25);
  });

  it('covers all service types', () => {
    const types = new Set(ALL_QUESTIONS.map((q) => q.serviceType));
    expect(types).toContain('児童発達支援');
    expect(types).toContain('放課後等デイサービス');
    expect(types).toContain('居宅訪問');
    expect(types).toContain('共通');
  });

  it('covers all difficulty levels', () => {
    const difficulties = new Set(ALL_QUESTIONS.map((q) => q.difficulty));
    expect(difficulties).toContain('初級');
    expect(difficulties).toContain('中級');
    expect(difficulties).toContain('上級');
  });

  it('has reasonable difficulty distribution', () => {
    const beginner = ALL_QUESTIONS.filter((q) => q.difficulty === '初級').length;
    const intermediate = ALL_QUESTIONS.filter((q) => q.difficulty === '中級').length;
    const advanced = ALL_QUESTIONS.filter((q) => q.difficulty === '上級').length;
    expect(beginner).toBeGreaterThanOrEqual(25);
    expect(intermediate).toBeGreaterThanOrEqual(25);
    expect(advanced).toBeGreaterThanOrEqual(15);
  });

  it('every 4択 question has exactly 4 choices and a valid answer index', () => {
    for (const q of ALL_QUESTIONS) {
      if (q.type !== '4択') continue;
      expect(q.choices).toHaveLength(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThanOrEqual(3);
    }
  });

  it('every ○× question has a boolean answer', () => {
    for (const q of ALL_QUESTIONS) {
      if (q.type !== '○×') continue;
      expect(typeof q.answer).toBe('boolean');
    }
  });

  it('every question has non-empty q, category, and explanation', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.q.length).toBeGreaterThan(0);
      expect(q.category.length).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });

  it('every question has source and sourceUrl', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.source).toBeDefined();
      expect(q.source!.length).toBeGreaterThan(0);
      expect(q.sourceUrl).toBeDefined();
      expect(q.sourceUrl!.length).toBeGreaterThan(0);
    }
  });
});
