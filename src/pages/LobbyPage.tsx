import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NourLogo from '@/components/NourLogo';
import QuizButton from '@/components/QuizButton';
import { formatPin, QUIZ_QUESTIONS } from '@/lib/quiz-data';
import type { Player } from '@/lib/quiz-data';

const LobbyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pin = searchParams.get('pin') || '';
  const navigate = useNavigate();

  const playerData: Player = JSON.parse(localStorage.getItem('playerData') || '{}');
  const isAdmin = localStorage.getItem('isAdmin_' + pin) === 'true' || playerData.isAdmin === true;

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const update = () => {
      const p = JSON.parse(localStorage.getItem('players_' + pin) || '[]');
      setPlayers(p);
    };
    update();
    const interval = setInterval(update, 1000);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'players_' + pin || e.key === 'lastUpdate_' + pin) update();
      if (e.key === 'quizStarted_' + pin && e.newValue === 'true') {
        navigate(`/quiz?pin=${pin}`);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); };
  }, [pin, navigate]);

  // Check if quiz already started
  useEffect(() => {
    if (localStorage.getItem('quizStarted_' + pin) === 'true') {
      const startTime = parseInt(localStorage.getItem('quizStartTime_' + pin) || '0');
      if (Date.now() - startTime < 5 * 60 * 1000) {
        navigate(`/quiz?pin=${pin}`);
      }
    }
  }, [pin, navigate]);

  const startQuiz = () => {
    if (players.length === 0) return;
    localStorage.setItem('quizStarted_' + pin, 'true');
    localStorage.setItem('quizStartTime_' + pin, Date.now().toString());
    navigate(`/quiz?pin=${pin}`);
  };

  return (
    <div className="min-h-screen gradient-lobby flex flex-col">
      <header className="flex justify-between items-center px-6 md:px-10 py-5 bg-black/30">
        <NourLogo size="sm" />
        <div className="bg-black/40 px-6 py-2 rounded-full text-lg font-bold">
          PIN: <span className="text-nour-lime ml-2">{formatPin(pin)}</span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 p-6 md:p-10 min-h-0">
        {/* Players */}
        <div className="bg-black/25 rounded-3xl p-8 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black">🎮 Joueurs</h2>
            <div className="bg-white/20 px-6 py-2 rounded-full text-2xl font-bold">{players.length}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto flex-1 pr-2">
            {players.map((player, i) => (
              <div
                key={player.nickname + i}
                className="bg-white/15 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-5 text-center animate-slide-in"
              >
                <div className="text-5xl mb-2 animate-bounce-gentle">{player.avatar}</div>
                <div className="font-bold text-base break-words">{player.nickname}</div>
                {player.isAdmin && (
                  <span className="inline-block mt-1 bg-nour-yellow text-nour-teal-dark text-xs font-black px-3 py-1 rounded-full">ADMIN</span>
                )}
              </div>
            ))}
            {players.length === 0 && (
              <div className="col-span-full text-center py-20 opacity-60 text-xl">
                Aucun joueur pour le moment...
              </div>
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-black/25 rounded-3xl p-8 text-center">
            <div className="gradient-quiz-thumb rounded-2xl h-44 flex items-center justify-center text-7xl mb-5 animate-pulse-scale">
              🧠
            </div>
            <h3 className="text-2xl font-black mb-2">Brain Rot Quiz</h3>
            <p className="opacity-80">{QUIZ_QUESTIONS.length} questions • 15s par question</p>
          </div>

          <div className="bg-black/25 rounded-3xl p-8 text-center">
            <div className="text-5xl mb-3 animate-spin" style={{ animationDuration: '3s' }}>⏳</div>
            <p className="text-2xl font-bold mb-2">En attente de joueurs...</p>
            <p className="opacity-70">Rejoignez sur NourQUIZ.com</p>
          </div>

          {isAdmin && (
            <div className="bg-black/25 rounded-3xl p-8 text-center">
              <span className="inline-block mb-4 bg-destructive px-5 py-2 rounded-full text-sm font-bold">👑 ADMIN</span>
              <QuizButton
                variant="start"
                onClick={startQuiz}
                disabled={players.length === 0}
                className="w-full"
              >
                Lancer le Quiz
              </QuizButton>
              <p className="mt-4 opacity-60">
                {players.length === 0 ? 'En attente de joueurs...' : `${players.length} joueur${players.length > 1 ? 's' : ''} prêt${players.length > 1 ? 's' : ''} !`}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LobbyPage;
