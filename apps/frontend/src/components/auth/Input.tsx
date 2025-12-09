import type { ChangeEvent } from 'react';

interface InputProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Input = ({ placeholder, type, value, onChange, disabled }: InputProps) => (
  <input
    className="rounded-lg bg-white/6 p-3 text-sm text-white/60 transition-colors duration-200 ease-in-out outline-none placeholder:text-sm placeholder:text-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
  />
);

export default Input;
