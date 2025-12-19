import logo from '@/assets/logo.png';
import { Icon, Input } from '@/components';
import { useAuth } from '@/hooks';
import { cn } from '@/utils';
import { useNavigate } from '@tanstack/react-router';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Button from './Button';
import PasswordInput from './PasswordInput';

const SignUp = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, password, name: name || null });
      navigate({ to: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-base relative flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <div className="shadow-base flex w-[340px] flex-col items-center gap-y-8 rounded-lg border p-8">
          <div className="flex items-center gap-x-2">
            <img src={logo} alt="Keep logo" className="size-12" />
            <div className="text-[24px]">Zeronotes</div>
          </div>
          <form className="flex w-full flex-col gap-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Name (optional)"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <div className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">{error}</div>
            )}
            <Button isLoading={isLoading} className="mt-2">
              Create account
            </Button>
            <div
              onClick={() => {
                if (isLoading) return;
                setError(null);
                navigate({ to: '/login' });
              }}
              className="mt-4 text-center text-sm text-white/40"
            >
              Already have an account?{' '}
              <span
                className={cn(
                  'transition-colors duration-200 ease-in-out',
                  isLoading
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer text-white/90 hover:text-white/80',
                )}
              >
                Login
              </span>
            </div>
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

export default SignUp;
