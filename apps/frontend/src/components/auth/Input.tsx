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
    className="rounded-lg bg-white/2 px-4 py-4 text-white/60 outline-none placeholder:text-white/20 disabled:cursor-not-allowed disabled:opacity-50"
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
  />
);

export default Input;
