import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AVATARS } from '@/lib/quiz-data';
import { formatPin } from '@/lib/quiz-data';
import QuizButton from '@/components/QuizButton';

const JoinPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pin = searchParams.get('pin') || '';
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');

  const randomAvatar = () => {
    const idx = Math.floor(Math.random() * AVATARS.length);
    setSelectedAvatar(AVATARS[idx]);
  };

  const clearForm = () => {
    setNickname('');
    setError('');
  };

  const joinGame = () => {
    if (!nickname.trim()) {
      setError('Veuillez entrer un nom !');
      return;
    }
    if (nickname.trim().length < 2) {
      setError('Le nom doit avoir au moins 2 caractères !');
      return;
    }

    const playerData = {
      nickname: nickname.trim(),
      avatar: selectedAvatar,
      pin,
      joinTime: Date.now(),
      isAdmin: false,
      score: 0,
    };

    localStorage.setItem('playerData', JSON.stringify(playerData));

    let players = JSON.parse(localStorage.getItem('players_' + pin) || '[]');
    const existingIndex = players.findIndex((p: any) => p.nickname === nickname.trim());
    if (existingIndex >= 0) {
      players[existingIndex] = playerData;
    } else {
      players.push(playerData);
    }
    localStorage.setItem('players_' + pin, JSON.stringify(players));
    localStorage.setItem('lastUpdate_' + pin, Date.now().toString());

    navigate(`/lobby?pin=${pin}`);
  };

  return (
    <div className="min-h-screen gradient-bg flex justify-center items-center p-4">
      <div className="bg-black/30 rounded-3xl p-8 md:p-10 max-w-[500px] w-full text-center">
        {/* PIN header */}
        <div className="bg-black/30 rounded-full px-8 py-3 inline-block mb-8">
          <p className="text-sm opacity-80">PIN code:</p>
          <p className="text-3xl font-black text-nour-lime tracking-wider">{formatPin(pin)}</p>
        </div>

        {/* Nickname input */}
        <div className="mb-8">
          <input
            type="text"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && joinGame()}
            placeholder="Entrez votre nom..."
            maxLength={20}
            className="w-full bg-white/95 text-nour-teal-dark border-4 border-nour-teal-dark rounded-2xl px-5 py-4 text-xl font-semibold text-center outline-none focus:bg-white focus:scale-[1.02] transition-all placeholder:text-nour-teal/50"
          />
          {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
        </div>

        {/* Avatar section */}
        <div className="mb-8">
          <p className="text-lg mb-4 opacity-90">Choisis ton personnage :</p>
          <div
            onClick={randomAvatar}
            className="w-36 h-36 mx-auto bg-white/10 border-4 border-white/30 rounded-full flex items-center justify-center text-7xl animate-bounce-gentle cursor-pointer hover:scale-110 hover:border-nour-lime transition-all"
          >
            {selectedAvatar}
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mt-6">
            {AVATARS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl cursor-pointer transition-all hover:scale-125 hover:bg-white/20 ${
                  selectedAvatar === avatar
                    ? 'border-3 border-nour-lime bg-nour-lime/20 scale-110'
                    : 'bg-white/10 border-2 border-transparent'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <QuizButton variant="clear" onClick={clearForm} className="flex-1">
            Effacer
          </QuizButton>
          <QuizButton variant="done" onClick={joinGame} className="flex-1">
            Rejoindre
          </QuizButton>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
