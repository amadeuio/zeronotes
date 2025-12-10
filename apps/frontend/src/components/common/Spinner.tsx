import { cn } from '@/utils';
import { useId } from 'react';

interface SpinnerProps {
  size?: number;
  thickness?: number;
  className?: string;
}

const Spinner = ({ size = 24, thickness = 6, className = '' }: SpinnerProps) => {
  const id = useId();
  const spinnerId = `spinner-${id}`;

  return (
    <>
      <style>
        {`
          @keyframes spinner-rotate-${spinnerId} {
            100% { transform: rotate(360deg); }
          }
          
          @keyframes spinner-dash-${spinnerId} {
            0% {
              stroke-dasharray: 1, 150;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 90, 150;
              stroke-dashoffset: -35;
            }
            100% {
              stroke-dasharray: 90, 150;
              stroke-dashoffset: -124;
            }
          }
          
          .spinner-${spinnerId} {
            animation:
              spinner-rotate-${spinnerId} 1.5s linear infinite,
              spinner-dash-${spinnerId} 1.5s ease-in-out infinite;
            transform-origin: center;
          }
        `}
      </style>
      <svg
        className={cn(`spinner-${spinnerId} stroke-neutral-400`, className)}
        width={size}
        height={size}
        viewBox="0 0 50 50"
      >
        <circle cx="25" cy="25" r="20" fill="none" strokeWidth={thickness} strokeLinecap="round" />
      </svg>
    </>
  );
};

export default Spinner;
