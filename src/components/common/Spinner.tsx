import { Icon } from '@/components';
import { cn } from '@/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner = ({ size = 24, className }: SpinnerProps) => (
  <Icon name="progress_activity" className={cn('animate-spin', className)} size={size} />
);

export default Spinner;
