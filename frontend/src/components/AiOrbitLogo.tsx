import React from 'react';

interface AiOrbitIconProps {
  className?: string;
  size?: number;
}

export const AiOrbitIcon: React.FC<AiOrbitIconProps> = ({ className = 'h-7 w-7', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="AIORBIT mark"
    >
      {/* Solid white circular background */}
      <circle cx="50" cy="50" r="50" fill="white" />

      {/* Satellite dot at top right */}
      <circle cx="68.5" cy="30.5" r="8" fill="black" />

      {/* Main upper orbital trajectory curve */}
      <path
        d="M 23 81.5 C 25.5 69 36 50.5 58 39.5 C 57.5 45 49.5 52.5 39 60.5 C 29 68 24.5 76 23 81.5 Z"
        fill="black"
      />

      {/* Secondary lower orbital swoosh */}
      <path
        d="M 12.5 81 C 15.5 74.5 22 66 33.5 58 C 30 62 23.5 71 18.5 87 C 14.5 86 13 83.5 12.5 81 Z"
        fill="black"
      />
    </svg>
  );
};

interface AiOrbitLogoProps {
  className?: string;
  iconSize?: number;
  showBadge?: boolean;
  textSize?: string;
}

export const AiOrbitLogo: React.FC<AiOrbitLogoProps> = ({
  className = '',
  iconSize = 28,
  showBadge = false,
  textSize = 'text-base sm:text-lg',
}) => {
  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {/* Icon mark */}
      <div className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <AiOrbitIcon size={iconSize} className={`h-[${iconSize}px] w-[${iconSize}px]`} />
      </div>

      {/* Wordmark */}
      <div className="flex items-center gap-2">
        <span className={`font-black tracking-tight text-white uppercase font-sans ${textSize}`}>
          AIORBIT
        </span>
        {showBadge && (
          <span className="hidden xs:inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold border border-neutral-800 bg-neutral-900 text-[#8E78E6]">
            DIRECTORY
          </span>
        )}
      </div>
    </div>
  );
};

export default AiOrbitLogo;
