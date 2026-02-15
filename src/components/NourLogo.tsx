import React from 'react';

interface NourLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-6xl',
};

const NourLogo: React.FC<NourLogoProps> = ({ size = 'md' }) => (
  <span className={`${sizeClasses[size]} font-black tracking-tighter`}>
    <span className="text-nour-pink text-shadow-bold">NOUR</span>
    <span className="text-nour-yellow text-shadow-bold">QUIZ</span>
    {size === 'lg' && <span className="text-nour-green text-2xl">.com</span>}
  </span>
);

export default NourLogo;
