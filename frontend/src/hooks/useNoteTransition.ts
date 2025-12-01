import { NOTE_WIDTH, NOTE_WIDTH_EXPANDED } from '@/constants';
import { useEffect, useState } from 'react';

const DURATION = 200;

interface UseNoteTransitionProps {
  position: { top: number; left: number } | null;
  onClose: () => void;
}

export const useNoteTransition = ({ position, onClose }: UseNoteTransitionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const initiateClose = () => {
    setIsOpen(false);
    setTimeout(onClose, DURATION);
  };

  const positionStyles = {
    top: isOpen ? '23%' : position?.top,
    left: isOpen ? `max(0px, calc(50% - ${NOTE_WIDTH_EXPANDED}px / 2))` : position?.left,
    maxWidth: isOpen ? `${NOTE_WIDTH_EXPANDED}px` : `${NOTE_WIDTH}px`,
    transform: isOpen ? 'translateY(-20%)' : undefined,
    transition: `all ${DURATION}ms ease-in-out`,
  };

  const backdropStyles = {
    opacity: isOpen ? 1 : 0,
    transition: `opacity ${DURATION}ms ease-in-out`,
  };

  return {
    positionStyles,
    backdropStyles,
    initiateClose,
  };
};
