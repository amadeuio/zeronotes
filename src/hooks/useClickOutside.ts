import { useEffect, useRef, type RefObject } from 'react';

interface UseClickOutsideMenuProps {
  elementRef: RefObject<HTMLElement | null>;
  onClickOutside: () => void;
}

export const useClickOutside = ({ elementRef, onClickOutside }: UseClickOutsideMenuProps) => {
  const callbackRef = useRef(onClickOutside);

  useEffect(() => {
    callbackRef.current = onClickOutside;
  }, [onClickOutside]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        callbackRef.current();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
};
