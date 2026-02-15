import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import NourLogo from '@/components/NourLogo';
import QuizButton from '@/components/QuizButton';
import { generatePin, formatPin, QUIZ_QUESTIONS } from '@/lib/quiz-data';
import { Switch } from '@/components/ui/switch';

const HostPage: React.FC = () => {
  const [pin, setPin] = useState(() => generatePin());
  const [playerCount, setPlayerCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('isAdmin_' + pin, 'true');
    localStorage.setItem('players_' + pin, JSON.stringify([]));
    localStorage.setItem('currentPin', pin);
  }, [pin]);

  useEffect(() => {
    const interval = setInterval(() => {
      const players = JSON.parse(localStorage.getItem('players_' + pin) || '[]');
      setPlayerCount(players.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [pin]);

  const joinUrl = `${window.location.origin}/join?pin=${pin}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const newPin = generatePin();
    setPin(newPin);
  };

  const goToLobby = () => {
    const adminData = {
      nickname: 'Admin',
      avatar: '👑',
      pin,
      joinTime: Date.now(),
      isAdmin: true,
      score: 0,
    };
    localStorage.setItem('playerData', JSON.stringify(adminData));
    localStorage.setItem('isAdmin_' + pin, 'true');
    let players = [adminData];
    localStorage.setItem('players_' + pin, JSON.stringify(players));
    localStorage.setItem('lastUpdate_' + pin, Date.now().toString());
    navigate(`/lobby?pin=${pin}`);
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-10 py-5 bg-black/20">
        <NourLogo size="md" />
        <div className="flex gap-6 items-center text-lg font-semibold">
          <span>PIN: <strong className="text-nour-lime">{formatPin(pin)}</strong></span>
          <span>👥 {playerCount}</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto w-full">
        {/* Left panel */}
        <div className="bg-black/25 rounded-3xl p-8 md:p-14 flex flex-col justify-center items-center gap-10">
          <div className="text-center">
            <p className="text-lg mb-3 opacity-90">Join at:</p>
            <NourLogo size="lg" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <QRCodeSVG value={joinUrl} size={220} fgColor="#2d5f7e" bgColor="#ffffff" />
          </div>

          <div className="text-center">
            <p className="text-lg mb-3 opacity-90">PIN code:</p>
            <div className="text-7xl md:text-8xl font-black text-nour-lime text-shadow-lg tracking-widest">
              {formatPin(pin)}
            </div>
            <div className="flex gap-4 justify-center mt-5">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-foreground/70 hover:bg-white/10 hover:text-foreground transition-all"
              >
                {copied ? '✓ Copié!' : '📋 Copier'}
              </button>
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-foreground/70 hover:bg-white/10 hover:text-foreground transition-all"
              >
                🔄 Régénérer
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-3xl font-bold mb-4">En attente de joueurs...</p>
            <p className="text-lg opacity-80">👤 Ou rejoindre sur cet appareil</p>
            <div className="mt-8">
              <QuizButton variant="start" onClick={goToLobby}>
                Aller au Lobby
              </QuizButton>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-6">
          {/* Quiz card */}
          <div className="bg-black/25 rounded-2xl p-6">
            <div className="gradient-quiz-thumb rounded-2xl p-10 text-center mb-5 relative overflow-hidden">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl opacity-30">🧠</span>
              <span className="relative z-10 text-3xl font-black text-nour-teal" style={{ textShadow: '2px 2px 0 rgba(255,255,255,0.5)' }}>
                BRAIN ROT
              </span>
            </div>
            <div className="space-y-2 text-base">
              <div className="flex items-center gap-3">📊 <strong>{QUIZ_QUESTIONS.length}</strong> questions</div>
              <div className="flex items-center gap-3">⏱️ <strong>15s</strong> par question</div>
              <div className="flex items-center gap-3">🌍 Anglais</div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-black/25 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-6">Paramètres</h3>
            <h4 className="text-lg font-semibold mb-4">Gameplay</h4>
            <div className="space-y-1">
              <SettingItem label="Mode équipe" description="Tous les joueurs en équipes" badge="NEW" />
              <SettingItem label="Cacher le classement" description="Cacher pendant le jeu" />
              <SettingItem label="Timer" description="15 secondes par question" defaultChecked />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SettingItem: React.FC<{ label: string; description: string; badge?: string; defaultChecked?: boolean }> = ({
  label, description, badge, defaultChecked,
}) => {
  const [checked, setChecked] = useState(defaultChecked || false);
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
      <div>
        <div className="text-base font-medium">
          {label}
          {badge && <span className="ml-2 bg-destructive text-foreground text-xs font-bold px-2.5 py-1 rounded-full">{badge}</span>}
        </div>
        <div className="text-sm text-foreground/60 mt-1">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
};

export default HostPage;
