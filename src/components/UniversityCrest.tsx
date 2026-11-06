import React, { useState } from 'react';
import bzuLogoImg from '../assets/images/bzu_logo.jpg';

interface UniversityCrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const UniversityCrest: React.FC<UniversityCrestProps> = ({
  className = '',
  size = 'md'
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  if (!imgError) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-md border-2 border-amber-400 bg-[#064e3b] ${sizeMap[size]} ${className}`}>
        <img
          src={bzuLogoImg}
          alt="Bahauddin Zakariya University Multan Official Logo"
          className="w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback high-fidelity SVG seal
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full shadow-md ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm rounded-full"
      >
        <circle cx="50" cy="50" r="48" fill="#064e3b" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43" fill="#022c22" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />

        {/* Heraldic Shield */}
        <path
          d="M 50 20 C 65 20, 72 26, 72 40 C 72 58, 58 72, 50 80 C 42 72, 28 58, 28 40 C 28 26, 35 20, 50 20 Z"
          fill="#047857"
          stroke="#fbbf24"
          strokeWidth="1.8"
        />

        {/* Crescent */}
        <path
          d="M 52 28 A 10 10 0 1 0 52 46 A 7.5 7.5 0 1 1 52 28 Z"
          fill="#fbbf24"
        />
        {/* Star */}
        <polygon
          points="54,34 55.5,36.5 58,37 56,39 56.5,41.5 54,40 51.5,41.5 52,39 50,37 52.5,36.5"
          fill="#ffffff"
        />

        {/* Open Book of Knowledge (Iqra) */}
        <path
          d="M 37 52 C 41 51, 46 52, 50 54 C 54 52, 59 51, 63 52 L 63 65 C 59 64, 54 65, 50 67 C 46 65, 41 64, 37 65 Z"
          fill="#f8fafc"
          stroke="#064e3b"
          strokeWidth="1.2"
        />
        <line x1="50" y1="54" x2="50" y2="67" stroke="#064e3b" strokeWidth="1.2" />
        <line x1="40" y1="56" x2="47" y2="56" stroke="#047857" strokeWidth="0.8" />
        <line x1="40" y1="59" x2="47" y2="59" stroke="#047857" strokeWidth="0.8" />
        <line x1="53" y1="56" x2="60" y2="56" stroke="#047857" strokeWidth="0.8" />
        <line x1="53" y1="59" x2="60" y2="59" stroke="#047857" strokeWidth="0.8" />

        {/* Minaret Spire */}
        <polygon points="50,11 52.5,16 47.5,16" fill="#fbbf24" />
        <circle cx="50" cy="10" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
};
