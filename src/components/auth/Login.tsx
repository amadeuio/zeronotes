import logo from '@/assets/logo.png';
import { useAuth } from '@/hooks';
import { useNavigate } from '@tanstack/react-router';
import type { FormEvent } from 'react';
import { useState } from 'react';

const Input = ({
  placeholder,
  type,
  value,
  onChange,
  disabled,
}: {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) => (
  <input
    className="rounded-lg bg-white/2 px-4 py-4 text-white/60 outline-none placeholder:text-white/20 disabled:cursor-not-allowed disabled:opacity-50"
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
  />
);

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
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
    <div className="bg-base flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <div className="hover:shadow-base flex w-[340px] flex-col items-center gap-y-10 rounded-lg border p-8">
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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-lg bg-white/2 p-4 text-white/80 transition-colors duration-200 ease-in-out hover:bg-white/3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-white/80">{isLoading ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
