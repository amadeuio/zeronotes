import { cn } from '@/utils';
import type { ReactNode } from 'react';
import { Icon } from '../common';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  iconName?: string;
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
}

const Button = ({
  variant = 'primary',
  iconName,
  isLoading = false,
  children,
  className = '',
}: ButtonProps) => (
  <button
    type="submit"
    className={cn(
      'flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-lg p-3 text-sm font-medium transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50',
      variant === 'primary' &&
        'border border-white/10 bg-white/10 hover:border-white/12 hover:bg-white/14',
      variant === 'secondary' && 'border border-white/18 hover:bg-white/2',
      className,
    )}
    disabled={isLoading}
  >
    {iconName && <Icon name={iconName} size={16} className="text-primary" />}
    {children}
  </button>
);

export default Button;
