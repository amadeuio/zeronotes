import { selectActions, useStore } from '@/store';
import { getGridColumnsFromWidth } from '@/utils';
import { useLayoutEffect, useRef } from 'react';

export const useSetGridColumns = () => {
  const { ui } = useStore(selectActions);
  const gridRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const updateColumns = () => {
      if (!gridRef.current) return;

      const gridWidth = gridRef.current.offsetWidth;
      const newColumns = getGridColumnsFromWidth(gridWidth);

      if (columnsRef.current !== newColumns) {
        columnsRef.current = newColumns;
        ui.setGridColumns(newColumns);
      }
    };

    updateColumns();

    const resizeObserver = new ResizeObserver(updateColumns);
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [ui]);

  return gridRef;
};
