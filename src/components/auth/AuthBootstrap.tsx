import { Icon } from '@/components';
import { useAuth } from '@/hooks';
import { useEffect, useState } from 'react';

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const { initialize } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize().finally(() => setIsLoading(false));
  }, [initialize]);

  return isLoading ? (
    <div className="flex h-screen items-center justify-center">
      <Icon name="progress_activity" className="animate-spin p-3 text-neutral-400" size={40} />
    </div>
  ) : (
    <> {children} </>
  );
};

export default AuthBootstrap;
