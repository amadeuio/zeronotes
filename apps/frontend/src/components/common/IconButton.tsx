import { Icon } from '@/components';
import { useOverflowCorrection } from '@/hooks';
import { cn } from '@/utils';
import { useRef, useState, type ReactNode } from 'react';

interface IconButtonProps {
  iconName: string;
  label: ReactNode;
  size?: number;
  className?: string;
  iconClassName?: string;
  filled?: boolean;
  onClick?: () => void;
}

const IconButton = ({
  iconName,
  label,
  size = 16,
  className,
  iconClassName,
  filled = false,
  onClick,
}: IconButtonProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const offset = useOverflowCorrection({
    isVisible: isTooltipVisible,
    elementRef: tooltipRef,
  });

  return (
    <button
      className={cn(
        'group relative flex cursor-pointer items-center justify-center rounded-full p-3 transition-colors duration-150 ease-in-out hover:bg-white/8',
        className,
      )}
      onClick={(e) => {
        setIsTooltipVisible(false);
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <Icon
        size={size}
        name={iconName}
        filled={filled}
        className={cn(
          'transition-colors duration-150 ease-in-out group-hover:text-neutral-100',
          iconClassName,
        )}
      />
      {isTooltipVisible && (
        <div
          ref={tooltipRef}
          className="absolute top-full left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded bg-neutral-700 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          {label}
        </div>
      )}
    </button>
  );
};

export default IconButton;
