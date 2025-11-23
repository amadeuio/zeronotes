import { selectActions, selectActiveNoteId, useStore } from '@/store';
import { useLayoutEffect, type RefObject } from 'react';

interface UseUpdateNoteHeightProps {
  noteId: string;
  noteRef: RefObject<HTMLDivElement | null>;
}

export const useUpdateNoteHeight = ({ noteId, noteRef }: UseUpdateNoteHeightProps) => {
  const { noteHeights } = useStore(selectActions);
  const activeNoteId = useStore(selectActiveNoteId);

  useLayoutEffect(() => {
    if (activeNoteId || !noteRef.current) return;

    const updateHeight = () => {
      if (!noteRef.current) return;
      noteHeights.update(noteId, noteRef.current.offsetHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(noteRef.current);

    return () => resizeObserver.disconnect();
  }, [activeNoteId]);
};
