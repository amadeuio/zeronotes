import { NOTE_WIDTH } from '@/constants';
import type { DisplayNote } from '@/types';
import { cn } from '@/utils';
import { useRef } from 'react';
import TextView from './TextView';

interface NoteGhostProps {
  note: DisplayNote;
  translate: { x: number; y: number };
  position: { x: number; y: number };
}

const NoteGhost = ({ note, translate, position: notePosition }: NoteGhostProps) => {
  const initialPositionRef = useRef<{ x: number; y: number }>(notePosition);

  return (
    <div
      className={cn(
        'absolute z-20 flex cursor-move flex-col gap-4 rounded-lg border px-4.5 pt-4.5 pb-14 opacity-96 shadow-[0_1px_12px_rgba(0,0,0,0.5)] select-none',
      )}
      style={{
        width: `${NOTE_WIDTH}px`,
        transform: `translate(${initialPositionRef.current.x + translate.x}px, ${initialPositionRef.current.y + translate.y}px)`,
        backgroundColor: note.colorValue ?? 'var(--color-base)',
        borderColor: note.colorValue ?? 'var(--color-secondary)',
      }}
    >
      <TextView isTitle value={note.title} />
      <TextView value={note.content} />
    </div>
  );
};

export default NoteGhost;
