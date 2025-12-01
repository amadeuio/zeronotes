import { GRID_GAP, NOTE_WIDTH } from '@/constants';

export const getTotalWidth = (gridColumns: number): number => {
  return gridColumns * NOTE_WIDTH + (gridColumns - 1) * GRID_GAP;
};

export const getGridColumnsFromWidth = (containerWidth: number): number => {
  return Math.max(1, Math.floor((containerWidth + GRID_GAP) / (NOTE_WIDTH + GRID_GAP)));
};

export const getSectionHeight = (
  notesOrder: string[],
  noteHeights: Record<string, number | null>,
  gridColumns: number,
): number => {
  const columnHeights = new Array(gridColumns).fill(0);

  for (let i = 0; i < notesOrder.length; i++) {
    const noteId = notesOrder[i];
    const column = i % gridColumns;
    const noteHeight = noteHeights[noteId] ?? 0;
    columnHeights[column] += noteHeight + GRID_GAP;
  }

  const maxHeight = Math.max(...columnHeights);
  return maxHeight - GRID_GAP;
};

export const getPositionFromNoteId = (
  noteId: string,
  notesOrder: string[],
  noteHeights: Record<string, number | null>,
  columns: number,
): { x: number; y: number } => {
  const orderIndex = notesOrder.indexOf(noteId);
  const column = orderIndex % columns;

  let y = 0;
  for (let i = 0; i < orderIndex; i++) {
    if (i % columns === column) {
      const height = noteHeights[notesOrder[i]] ?? 0;
      y += height + GRID_GAP;
    }
  }

  return {
    x: column * (NOTE_WIDTH + GRID_GAP),
    y,
  };
};

export const getNoteIdFromPosition = (
  x: number,
  y: number,
  notesOrder: string[],
  noteHeights: Record<string, number | null>,
  columns: number,
): string | undefined => {
  const col = Math.floor(x / (NOTE_WIDTH + GRID_GAP));
  if (col < 0 || col >= columns) return undefined;

  const columnHeights: number[] = new Array(columns).fill(0);

  for (let i = 0; i < notesOrder.length; i++) {
    const noteId = notesOrder[i];
    const noteColumn = i % columns;
    const height = noteHeights[noteId] ?? 0;

    if (noteColumn === col) {
      if (y >= columnHeights[noteColumn] && y < columnHeights[noteColumn] + height) {
        return noteId;
      }
      columnHeights[noteColumn] += height + GRID_GAP;
    } else {
      columnHeights[noteColumn] += height + GRID_GAP;
    }
  }

  return undefined;
};
