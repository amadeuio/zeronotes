import { useClickOutside, useOverflowCorrection } from '@/hooks';
import { useRef, useState, type ReactNode } from 'react';

interface MenuTriggerProps {
  children: ReactNode;
  menu: ReactNode;
  onClickOutside?: () => void;
  recalculateOverflowCorrection?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const MenuTrigger = ({
  children,
  menu,
  onClickOutside,
  recalculateOverflowCorrection,
  onOpenChange,
}: MenuTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const offset = useOverflowCorrection({
    isVisible: isOpen,
    elementRef: menuRef,
    recalculateOverflowCorrection,
  });

  const handleClickOutside = () => {
    setIsOpen(false);
    onOpenChange?.(false);
    onClickOutside?.();
  };

  useClickOutside({ elementRef: menuRef, onClickOutside: handleClickOutside });

  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
          onOpenChange?.(true);
        }}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 z-10"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          {menu}
        </div>
      )}
    </div>
  );
};

export default MenuTrigger;
