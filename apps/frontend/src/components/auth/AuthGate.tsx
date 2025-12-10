import { Spinner } from '@/components';
import { useAuthRestore } from '@/hooks';
import type { ReactNode } from 'react';

const SpinnerScreen = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner size={34} thickness={4} />
  </div>
);

interface AuthGateProps {
  children: ReactNode;
}

const AuthGate = ({ children }: AuthGateProps) => {
  const { isLoading } = useAuthRestore();

  return isLoading ? <SpinnerScreen /> : children;
};

export default AuthGate;
