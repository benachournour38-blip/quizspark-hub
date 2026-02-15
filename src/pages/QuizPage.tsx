import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';
import type { QuizQuestion } from '@/lib/quiz-data';
import NourLogo from '@/components/NourLogo';

const ANSWER_COLORS = [
  'bg-quiz-red hover:brightness-110',
  'bg-quiz-blue hover:brightness-110',
  'bg-quiz-yellow hover:brightness-110',
  'bg-quiz-green hover:brightness-110',
];
const ANSWER_SHAPES = ['▲', '◆', '●', '■'];

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pin = searchParams.get('pin') || '';
  const navigate = useNavigate();

  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  const question: QuizQuestion = QUIZ_QUESTIONS[currentQ];

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null || showResult) return;
    setSelected(idx);
    setShowResult(true);

    if (idx === question.correctIndex) {
      const timeBonus = Math.round((timeLeft / question.timeLimit) * 1000);
      const streakBonus = streak * 100;
      setScore((s) => s + timeBonus + streakBonus);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  }, [selected, showResult, question, timeLeft, streak]);

  // Timer
  useEffect(() => {
    if (showResult || gameOver) return;
    if (timeLeft <= 0) {
      setShowResult(true);
      setStreak(0);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showResult, gameOver]);

  const nextQuestion = () => {
    if (currentQ + 1 >= QUIZ_QUESTIONS.length) {
      setGameOver(true);
      // Save score
      const playerData = JSON.parse(localStorage.getItem('playerData') || '{}');
      playerData.score = score;
      localStorage.setItem('playerData', JSON.stringify(playerData));
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(15);
  };

  const goHome = () => {
    localStorage.removeItem('quizStarted_' + pin);
    navigate('/');
  };

  if (gameOver) {
    return (
      <div className="min-h-screen gradient-lobby flex items-center justify-center p-4">
        <div className="bg-black/30 backdrop-blur rounded-3xl p-10 max-w-lg w-full text-center">
          <div className="text-7xl mb-6">🏆</div>
          <h1 className="text-4xl font-black mb-4">Quiz Terminé !</h1>
          <p className="text-6xl font-black text-nour-lime mb-2">{score}</p>
          <p className="text-xl opacity-80 mb-2">points</p>
          <p className="opacity-60 mb-8">{QUIZ_QUESTIONS.length} questions complétées</p>
          <button
            onClick={goHome}
            className="bg-gradient-to-b from-primary to-nour-lime-dark text-primary-foreground font-black text-xl py-4 px-12 rounded-full shadow-[var(--shadow-btn-start)] hover:translate-y-[-3px] hover:shadow-[var(--shadow-btn-start-hover)] active:translate-y-[5px] active:shadow-[var(--shadow-btn-start-active)] transition-all cursor-pointer"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/30">
        <NourLogo size="sm" />
        <div className="flex gap-6 items-center font-bold text-lg">
          <span>Q {currentQ + 1}/{QUIZ_QUESTIONS.length}</span>
          <span>🔥 {streak}</span>
          <span className="text-nour-lime">⭐ {score}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Timer bar */}
        <div className="w-full bg-black/30 rounded-full h-4 mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${(timeLeft / question.timeLimit) * 100}%`,
              background: timeLeft <= 5 ? 'hsl(0 72% 51%)' : timeLeft <= 10 ? 'hsl(45 93% 47%)' : 'hsl(var(--nour-lime))',
            }}
          />
        </div>

        {/* Timer number */}
        <div className={`text-center mb-6 ${timeLeft <= 5 ? 'animate-timer-pulse' : ''}`}>
          <span className={`text-5xl font-black ${timeLeft <= 5 ? 'text-quiz-red' : 'text-nour-lime'}`}>
            {timeLeft}
          </span>
        </div>

        {/* Question */}
        <div className="bg-black/30 rounded-2xl p-6 md:p-8 mb-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold">{question.question}</h2>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {question.answers.map((answer, idx) => {
            const isCorrect = idx === question.correctIndex;
            const isSelected = idx === selected;
            let extraClass = '';
            if (showResult) {
              if (isCorrect) extraClass = 'ring-4 ring-white scale-105';
              else if (isSelected && !isCorrect) extraClass = 'opacity-50 scale-95';
              else extraClass = 'opacity-40';
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`${ANSWER_COLORS[idx]} ${extraClass} text-foreground font-bold text-base md:text-lg p-5 md:p-6 rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-default flex items-center gap-4 text-left`}
              >
                <span className="text-2xl opacity-70">{ANSWER_SHAPES[idx]}</span>
                <span>{answer}</span>
                {showResult && isCorrect && <span className="ml-auto text-2xl">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="ml-auto text-2xl">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {showResult && (
          <div className="text-center mt-8">
            <div className="mb-4 text-lg font-bold">
              {selected === question.correctIndex ? (
                <span className="text-nour-green">✨ Correct ! +{Math.round((timeLeft / question.timeLimit) * 1000) + streak * 100} points</span>
              ) : selected !== null ? (
                <span className="text-destructive">❌ Mauvaise réponse !</span>
              ) : (
                <span className="text-nour-yellow">⏰ Temps écoulé !</span>
              )}
            </div>
            <button
              onClick={nextQuestion}
              className="bg-gradient-to-b from-primary to-nour-lime-dark text-primary-foreground font-black text-xl py-4 px-12 rounded-full shadow-[var(--shadow-btn-start)] hover:translate-y-[-3px] hover:shadow-[var(--shadow-btn-start-hover)] active:translate-y-[5px] active:shadow-[var(--shadow-btn-start-active)] transition-all cursor-pointer"
            >
              {currentQ + 1 < QUIZ_QUESTIONS.length ? 'Question Suivante →' : 'Voir les Résultats'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
