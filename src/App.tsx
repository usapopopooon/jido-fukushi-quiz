import { useState } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import StartScreen from '@/components/StartScreen';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';
import StudyListScreen from '@/components/StudyListScreen';
import StudyDetailScreen from '@/components/StudyDetailScreen';
import type { Screen, StudyTopic } from '@/types/quiz';

export default function App() {
  const {
    screen: quizScreen,
    currentQuestion,
    currentIndex,
    totalCount,
    score,
    results,
    answered,
    isCorrect,
    startQuiz,
    answer4,
    answerOX,
    nextQuestion,
  } = useQuiz();

  const [appScreen, setAppScreen] = useState<Screen>('start');
  const [selectedTopic, setSelectedTopic] = useState<StudyTopic | null>(null);

  // Quiz flow uses its own screen state
  const activeScreen = quizScreen !== 'start' ? quizScreen : appScreen;

  if (activeScreen === 'quiz' && currentQuestion) {
    return (
      <QuizScreen
        question={currentQuestion}
        currentIndex={currentIndex}
        totalCount={totalCount}
        answered={answered}
        isCorrect={isCorrect}
        onAnswer4={answer4}
        onAnswerOX={answerOX}
        onNext={nextQuestion}
      />
    );
  }

  if (activeScreen === 'result') {
    return (
      <ResultScreen
        score={score}
        totalCount={totalCount}
        results={results}
        onRestart={() => window.location.reload()}
      />
    );
  }

  if (activeScreen === 'studyDetail' && selectedTopic) {
    return (
      <StudyDetailScreen
        topic={selectedTopic}
        onBack={() => {
          setSelectedTopic(null);
          setAppScreen('studyList');
        }}
      />
    );
  }

  if (activeScreen === 'studyList') {
    return (
      <StudyListScreen
        onSelect={(topic) => {
          setSelectedTopic(topic);
          setAppScreen('studyDetail');
        }}
        onBack={() => setAppScreen('start')}
      />
    );
  }

  return (
    <StartScreen
      onStart={startQuiz}
      onStudy={() => setAppScreen('studyList')}
    />
  );
}
