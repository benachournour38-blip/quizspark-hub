import React from 'react';
import { useNavigate } from 'react-router-dom';
import NourLogo from '@/components/NourLogo';
import QuizButton from '@/components/QuizButton';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-8 animate-bounce-gentle">
        <span className="text-8xl">🧠</span>
      </div>
      <div className="mb-4">
        <NourLogo size="lg" />
      </div>
      <p className="text-xl opacity-80 mb-12 max-w-md">
        Créez et jouez à des quiz interactifs avec vos amis en temps réel !
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <QuizButton variant="start" onClick={() => navigate('/host')}>
          🎮 Héberger un Quiz
        </QuizButton>
        <button
          onClick={() => {
            const pin = prompt('Entrez le code PIN du quiz :');
            if (pin) navigate(`/join?pin=${pin.replace(/\s/g, '')}`);
          }}
          className="bg-white/20 backdrop-blur border-2 border-white/30 text-foreground font-black text-2xl py-5 px-16 rounded-full hover:bg-white/30 transition-all cursor-pointer uppercase"
        >
          🔑 Rejoindre
        </button>
      </div>
    </div>
  );
};

export default Index;
