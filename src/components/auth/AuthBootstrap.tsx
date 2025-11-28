import { Icon } from '@/components';
import { useAuth } from '@/hooks';
import { useEffect, useState } from 'react';

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const { initializeMe } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const GOOD_TOKEN = import.meta.env.VITE_SEED_TOKEN;
  localStorage.setItem('token', GOOD_TOKEN);

  useEffect(() => {
    const fetchMe = async () => {
      setIsLoading(true);
      await initializeMe();
      setIsLoading(false);
    };
    fetchMe();
  }, []);

  return isLoading ? (
    <div className="flex h-screen items-center justify-center">
      <Icon name="progress_activity" className="animate-spin p-3 text-neutral-400" size={40} />
    </div>
  ) : (
    <> {children} </>
  );
};

export default AuthBootstrap;
