import { useReducer, useCallback } from 'react';
import { ALL_QUESTIONS } from '../data/questions';
import type { Question, Question4, Screen, AnswerResult, ServiceType, Difficulty } from '../types/quiz';

interface QuizState {
  screen: Screen;
  questions: Question[];
  currentIndex: number;
  score: number;
  results: AnswerResult[];
  answered: boolean;
  isCorrect: boolean | null;
}

type QuizAction =
  | { type: 'START'; selectedServices: ServiceType[]; selectedDifficulties: Difficulty[] }
  | { type: 'ANSWER'; correct: boolean; question: Question }
  | { type: 'NEXT' };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function shuffleQuestion(q: Question): Question {
  if (q.type !== '4択') return q;
  const indexed = q.choices.map((text, orig) => ({ text, orig }));
  const shuffled = shuffle(indexed);
  return {
    ...q,
    choices: shuffled.map((c) => c.text) as Question4['choices'],
    answer: shuffled.findIndex((c) => c.orig === q.answer) as 0 | 1 | 2 | 3,
  };
}

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START': {
      const filtered = ALL_QUESTIONS.filter(
        (q) =>
          (q.serviceType === '共通' ||
            action.selectedServices.includes(q.serviceType)) &&
          action.selectedDifficulties.includes(q.difficulty),
      );
      return {
        screen: 'quiz',
        questions: shuffle(filtered).map(shuffleQuestion),
        currentIndex: 0,
        score: 0,
        results: [],
        answered: false,
        isCorrect: null,
      };
    }
    case 'ANSWER':
      return {
        ...state,
        answered: true,
        isCorrect: action.correct,
        score: action.correct ? state.score + 1 : state.score,
        results: [...state.results, { question: action.question, correct: action.correct }],
      };
    case 'NEXT': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, screen: 'result', answered: false, isCorrect: null };
      }
      return { ...state, currentIndex: nextIndex, answered: false, isCorrect: null };
    }
    default:
      return state;
  }
}

const initialState: QuizState = {
  screen: 'start',
  questions: [],
  currentIndex: 0,
  score: 0,
  results: [],
  answered: false,
  isCorrect: null,
};

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startQuiz = useCallback(
    (selectedServices: ServiceType[], selectedDifficulties: Difficulty[]) =>
      dispatch({ type: 'START', selectedServices, selectedDifficulties }),
    [],
  );

  const answer4 = useCallback(
    (idx: number) => {
      if (state.answered) return;
      const q = state.questions[state.currentIndex];
      if (q.type !== '4択') return;
      dispatch({ type: 'ANSWER', correct: idx === q.answer, question: q });
    },
    [state],
  );

  const answerOX = useCallback(
    (val: boolean) => {
      if (state.answered) return;
      const q = state.questions[state.currentIndex];
      if (q.type !== '○×') return;
      dispatch({ type: 'ANSWER', correct: val === q.answer, question: q });
    },
    [state],
  );

  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT' }), []);

  return {
    screen: state.screen,
    currentQuestion: state.questions[state.currentIndex] ?? null,
    currentIndex: state.currentIndex,
    totalCount: state.questions.length,
    score: state.score,
    results: state.results,
    answered: state.answered,
    isCorrect: state.isCorrect,
    startQuiz,
    answer4,
    answerOX,
    nextQuestion,
  };
}
