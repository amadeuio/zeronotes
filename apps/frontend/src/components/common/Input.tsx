import { cn } from '@/utils';
import type { ChangeEvent } from 'react';

interface InputProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

const Input = ({ placeholder, type, value, onChange, disabled, className }: InputProps) => (
  <input
    className={cn(
      'text-primary w-full rounded-lg border border-white/3 bg-white/8 p-3 text-sm transition-colors duration-200 ease-in-out outline-none placeholder:text-sm placeholder:text-white/20 hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
  />
);

export default Input;
