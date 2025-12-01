import { useEffect, useState } from 'react';

export const useMountDelay = (): boolean => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1);
    return () => clearTimeout(timer);
  }, []);

  return isReady;
};
