import { cn } from '@/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner = ({ size = 24, className }: SpinnerProps) => (
  <span
    className={cn('material-symbols-outlined animate-spin', className)}
    style={{
      fontSize: `${size}px`,
      fontVariationSettings: '"wght" 500',
    }}
  >
    progress_activity
  </span>
);

export default Spinner;
