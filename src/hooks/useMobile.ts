import { selectActions, useStore } from '@/store';
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;
const DEBOUNCE_DELAY = 150;

export const useMobile = () => {
  const { ui } = useStore(selectActions);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }, DEBOUNCE_DELAY);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      ui.closeSidebar();
    }
  }, [isMobile, ui]);

  return isMobile;
};
