import logo from '@/assets/logo.png';
import { useAuth } from '@/hooks';
import { useNavigate } from '@tanstack/react-router';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Icon } from '../common';
import Button from './Button';
import Input from './Input';

const Separator = () => (
  <div className="flex w-full items-center gap-x-4 py-4">
    <div className="h-px flex-1 bg-white/20"></div>
    <span className="text-sm text-white/40">OR</span>
    <div className="h-px flex-1 bg-white/20"></div>
  </div>
);

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
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
      await login({ email, password });
      navigate({ to: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
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
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <div className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">{error}</div>
            )}
            <Button isLoading={isLoading} className="mt-2">
              Login
            </Button>
            <Separator />
            <Button variant="secondary" isLoading={isLoading} iconName="visibility">
              Demo Mode
            </Button>
            <div
              onClick={() => {
                setError(null);
                navigate({ to: '/signup' });
              }}
              className="mt-4 text-center text-sm text-white/40"
            >
              Don't have an account?{' '}
              <span className="text-primary cursor-pointer transition-colors duration-200 ease-in-out hover:text-white/80">
                Sign up
              </span>
            </div>
          </form>

          <div className="absolute bottom-6 flex w-full items-center justify-center gap-x-1 text-sm text-white/40">
            <Icon name="lock" size={18} className="text-white/40" />
            <span>End-to-end encrypted notes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
