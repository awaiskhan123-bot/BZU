
import React from 'react';
import bzuLogoImg from '../assets/images/bzu_logo.jpg';

interface UniversityCrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const UniversityCrest: React.FC<UniversityCrestProps> = ({
  className = '',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-md border-2 border-amber-400 bg-white ${sizeMap[size]} ${className}`}
    >
      <img
        src={bzuLogoImg}
        alt="Official Bahauddin Zakariya University Multan Logo"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
};
