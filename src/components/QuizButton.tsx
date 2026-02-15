import React from 'react';
import { cn } from '@/lib/utils';

interface QuizButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'start' | 'clear' | 'done' | 'answer-red' | 'answer-blue' | 'answer-yellow' | 'answer-green';
}

const variantStyles: Record<string, string> = {
  start: 'bg-gradient-to-b from-primary to-nour-lime-dark text-primary-foreground font-black text-2xl py-5 px-16 rounded-full uppercase shadow-[var(--shadow-btn-start)] hover:translate-y-[-3px] hover:shadow-[var(--shadow-btn-start-hover)] active:translate-y-[5px] active:shadow-[var(--shadow-btn-start-active)]',
  clear: 'bg-gradient-to-b from-destructive/80 to-destructive text-foreground font-black text-xl py-4 rounded-full uppercase shadow-[var(--shadow-btn-clear)] hover:translate-y-[-2px] active:translate-y-[4px]',
  done: 'bg-gradient-to-b from-nour-green to-emerald-400 text-foreground font-black text-xl py-4 rounded-full uppercase shadow-[var(--shadow-btn-done)] hover:translate-y-[-2px] active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed',
  'answer-red': 'bg-quiz-red text-foreground font-bold text-lg p-6 rounded-lg hover:brightness-110 active:scale-95',
  'answer-blue': 'bg-quiz-blue text-foreground font-bold text-lg p-6 rounded-lg hover:brightness-110 active:scale-95',
  'answer-yellow': 'bg-quiz-yellow text-foreground font-bold text-lg p-6 rounded-lg hover:brightness-110 active:scale-95',
  'answer-green': 'bg-quiz-green text-foreground font-bold text-lg p-6 rounded-lg hover:brightness-110 active:scale-95',
};

const QuizButton: React.FC<QuizButtonProps> = ({ variant = 'start', className, children, ...props }) => (
  <button
    className={cn('cursor-pointer transition-all duration-200', variantStyles[variant], className)}
    {...props}
  >
    {children}
  </button>
);

export default QuizButton;
