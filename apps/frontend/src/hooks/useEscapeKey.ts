import { useEffect, useRef } from 'react';

interface UseEscapeKeyProps {
  onEscape: () => void;
}

export const useEscapeKey = ({ onEscape }: UseEscapeKeyProps) => {
  const callbackRef = useRef(onEscape);

  useEffect(() => {
    callbackRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callbackRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
