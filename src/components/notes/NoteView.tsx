import { IconButton } from '@/components';
import { NOTE_WIDTH } from '@/constants';
import { useDrag, useMountDelay, useUpdateNoteHeight } from '@/hooks';
import {
  selectActions,
  selectFiltersSearch,
  useSelectIsNoteActive,
  useSelectPositionFromNoteId,
  useStore,
} from '@/store';
import type { DisplayNote } from '@/types';
import { cn } from '@/utils';
import { useRef, useState, type MouseEvent } from 'react';
import Label from './Label';
import NoteGhost from './NoteGhost';
import NoteToolbar from './NoteToolbar/NoteToolbar';
import TextView from './TextView';

interface NoteViewProps {
  note: DisplayNote;
}

const NoteView = ({ note }: NoteViewProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { notes, activeNote } = useStore(selectActions);
  const isActive = useSelectIsNoteActive(note.id);
  const search = useStore(selectFiltersSearch);
  const position = useSelectPositionFromNoteId(note.id, note.isPinned);
  const noteRef = useRef<HTMLDivElement | null>(null);
  const isReady = useMountDelay();
  const { isDragging, translate, handleMouseDown } = useDrag({
    noteId: note.id,
    notePosition: position,
    noteRef,
  });
  useUpdateNoteHeight({
    noteId: note.id,
    noteRef,
  });

  const handleClick = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    activeNote.set({
      id: note.id,
      position: {
        top: rect.top,
        left: rect.left,
      },
    });
  };

  return (
    <>
      <div
        ref={noteRef}
        className={cn(
          'group/note hover:shadow-base absolute flex flex-col gap-4 rounded-lg border px-4.5 pt-4.5 pb-14 select-none hover:z-20',
          isMenuOpen && 'z-30',
        )}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        style={{
          backgroundColor: note.colorValue ?? 'var(--color-base)',
          borderColor: note.colorValue ?? 'var(--color-secondary)',
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isReady
            ? 'transform 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out'
            : 'none',
          opacity: isDragging || isActive || !isReady ? 0 : 1,
          width: `${NOTE_WIDTH}px`,
        }}
      >
        <IconButton
          size={24}
          iconName="push_pin"
          label={note.isPinned ? 'Unpin note' : 'Pin note'}
          filled={note.isPinned}
          className={cn(
            'absolute top-2 right-2 p-1 transition-opacity duration-400 ease-in-out',
            !isMenuOpen && 'opacity-0 group-hover/note:opacity-100',
          )}
          iconClassName="text-neutral-300"
          onClick={() => notes.togglePin(note.id)}
        />
        {note.title && <TextView isTitle value={note.title} searchTerm={search} />}
        <TextView value={note.content} searchTerm={search} />
        <div className="flex flex-wrap gap-1.5">
          {note.labels.map((label) => (
            <Label
              key={label.id}
              label={label}
              onClose={() => notes.removeLabel(note.id, label.id)}
            />
          ))}
        </div>
        <NoteToolbar
          note={note}
          onMenuOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
          className={cn(
            'absolute bottom-1.5 left-1.5 transition-opacity duration-400 ease-in-out',
            !isMenuOpen && 'opacity-0 group-hover/note:opacity-100',
          )}
        />
      </div>
      {isDragging && <NoteGhost note={note} translate={translate} position={position} />}
    </>
  );
};

export default NoteView;
