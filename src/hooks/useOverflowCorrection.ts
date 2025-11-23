import { useEffect, useState, type RefObject } from 'react';

interface UseOverflowCorrectionProps {
  isVisible: boolean;
  elementRef: RefObject<HTMLElement | null>;
  margin?: number;
  recalculateOverflowCorrection?: boolean;
}

export const useOverflowCorrection = ({
  isVisible,
  elementRef,
  margin = 8,
  recalculateOverflowCorrection,
}: UseOverflowCorrectionProps) => {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const defaultTriggerHeight = 34;

  useEffect(() => {
    const calculateOverflowCorrection = () => {
      if (!isVisible || !elementRef.current) {
        setOffset({ x: 0, y: 0 });
        return;
      }

      const elementRect = elementRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let x = 0;
      let y = 0;

      // Horizontal overflow
      if (elementRect.right > viewport.width) {
        x = viewport.width - elementRect.right - margin;
      } else if (elementRect.left < 0) {
        x = -elementRect.left + margin;
      }

      // Vertical overflow
      if (elementRect.bottom > viewport.height) {
        y = -elementRect.height - defaultTriggerHeight - 6;
      } else if (elementRect.top < 0) {
        y = defaultTriggerHeight + margin + 6;
      }

      setOffset({ x, y });
    };

    calculateOverflowCorrection();
  }, [isVisible, margin, recalculateOverflowCorrection, elementRef]);

  return offset;
};
