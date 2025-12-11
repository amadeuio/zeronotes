import { IconButton, Input } from '@/components';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const PasswordInput = ({ placeholder, value, onChange, disabled }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <IconButton
        onClick={() => setShowPassword(!showPassword)}
        label={showPassword ? 'Hide' : 'Show'}
        iconName={showPassword ? 'visibility_off' : 'visibility'}
        size={20}
        className="absolute top-1/2 right-1 -translate-y-1/2 p-2"
      />
    </div>
  );
};

export default PasswordInput;
