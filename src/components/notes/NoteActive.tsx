import { IconButton } from '@/components';
import { useEscapeKey, useNoteTransition } from '@/hooks';
import {
  selectActions,
  selectActiveNoteDisplay,
  selectActiveNotePosition,
  useStore,
} from '@/store';
import Label from './Label';
import NoteToolbar from './NoteToolbar/NoteToolbar';
import TextEdit from './TextEdit';

const NoteActive = () => {
  const note = useStore(selectActiveNoteDisplay)!;
  const position = useStore(selectActiveNotePosition);
  const { activeNote, notes } = useStore(selectActions);
  const { positionStyles, backdropStyles, initiateClose } = useNoteTransition({
    position,
    onClose: () => activeNote.set({ id: null, position: null }),
  });

  useEscapeKey({ onEscape: initiateClose });

  return (
    <div className="fixed inset-0 z-50" onClick={initiateClose}>
      <div className="absolute inset-0 bg-neutral-800/60" style={backdropStyles} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="shadow-base relative flex flex-col gap-4 rounded-lg border px-4.5 pt-4.5 pb-14"
        style={{
          backgroundColor: note.colorValue ?? 'var(--color-base)',
          borderColor: note.colorValue ?? 'var(--color-secondary)',
          ...positionStyles,
          transition: `${positionStyles.transition}, background-color 200ms ease-in-out, border-color 200ms ease-in-out`,
        }}
      >
        <IconButton
          size={24}
          iconName="push_pin"
          label={note.isPinned ? 'Unpin note' : 'Pin note'}
          filled={note.isPinned}
          className="absolute top-2 right-2 p-1"
          iconClassName="text-neutral-300"
          onClick={() => notes.togglePin(note.id)}
        />
        <TextEdit
          isTitle
          value={note.title}
          onChange={(value: string) => notes.updateTitle(note.id, value)}
          placeholder="Title"
          className="pr-6"
        />
        <TextEdit
          value={note.content}
          onChange={(value: string) => notes.updateContent(note.id, value)}
          placeholder="Take a note..."
        />
        <div className="flex flex-wrap gap-1.5">
          {note.labels.map((label) => (
            <Label
              key={label.id}
              label={label}
              onClose={() => notes.removeLabel(note.id, label.id)}
            />
          ))}
        </div>
        <NoteToolbar note={note} className="absolute bottom-1.5 left-1.5" />
      </div>
    </div>
  );
};

export default NoteActive;
