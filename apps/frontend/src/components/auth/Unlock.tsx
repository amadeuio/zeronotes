import { Icon } from '@/components';
import { useAuth } from '@/hooks';
import { selectUser, useStore } from '@/store';
import { getErrorMessage } from '@/utils';
import { useNavigate } from '@tanstack/react-router';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Button from './Button';
import PasswordInput from './PasswordInput';

const Unlock = () => {
  const { unlock, logout } = useAuth();
  const user = useStore(selectUser);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      await unlock(password);
      navigate({ to: '/' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-base relative flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <div className="shadow-base flex w-[340px] flex-col items-center gap-y-8 rounded-lg border p-8">
          <div className="flex flex-col items-center gap-y-2">
            <div className="flex items-center gap-x-2">
              <Icon name="lock" size={24} />
              <div className="text-xl">App Locked</div>
            </div>
            {user?.email && <span className="text-xs text-neutral-500">{user.email}</span>}
          </div>
          <form className="flex w-full flex-col gap-y-4" onSubmit={handleSubmit}>
            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <div className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">{error}</div>
            )}
            <Button isLoading={isLoading}>Unlock</Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading}
              onClick={() => {
                logout();
                navigate({ to: '/login' });
              }}
              iconName="logout"
            >
              Log Out
            </Button>
          </form>
          <div className="absolute bottom-6 flex w-full items-center justify-center gap-x-1 text-sm text-white/40">
            <Icon name="lock" size={18} className="text-white/40" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unlock;
