import { useQuiz } from './hooks/useQuiz';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const {
    screen,
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

  if (screen === 'quiz' && currentQuestion) {
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

  if (screen === 'result') {
    return (
      <ResultScreen
        score={score}
        totalCount={totalCount}
        results={results}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return <StartScreen onStart={startQuiz} />;
}
