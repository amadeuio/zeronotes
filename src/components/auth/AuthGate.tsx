import { Icon } from '@/components';
import { useAuthRestore } from '@/hooks';
import type { ReactNode } from 'react';

interface AuthGateProps {
  children: ReactNode;
}

const AuthGate = ({ children }: AuthGateProps) => {
  const { isLoading } = useAuthRestore();

  return isLoading ? (
    <div className="flex h-screen items-center justify-center">
      <Icon name="progress_activity" className="animate-spin p-3 text-neutral-400" size={40} />
    </div>
  ) : (
    children
  );
};

export default AuthGate;
