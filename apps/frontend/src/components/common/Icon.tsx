import { cn } from '@/utils';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
  onClick?: () => void;
}

const Icon = ({ name, size = 22, className, filled = false, onClick }: IconProps) => (
  <span
    className={cn('material-symbols-outlined text-neutral-400', className)}
    style={{
      fontSize: `${size}px`,
      fontVariationSettings: filled ? '"FILL" 1' : undefined,
    }}
    onClick={onClick}
  >
    {name}
  </span>
);

export default Icon;
