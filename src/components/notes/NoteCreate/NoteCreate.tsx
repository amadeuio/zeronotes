import { IconButton } from '@/components';
import { NOTE_WIDTH_EXPANDED } from '@/constants';
import { useClickOutside } from '@/hooks';
import { selectActions, useStore } from '@/store';
import { cn, getColorValue } from '@/utils';
import { useReducer, useRef, useState, type MouseEvent } from 'react';
import Label from '../Label';
import TextEdit from '../TextEdit';
import { CreateToolbar } from './CreateToolbar';
import { initialState, noteReducer } from './reducer';

interface NoteCreateProps {
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

const NoteCreate = ({ onClick, className }: NoteCreateProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [state, dispatch] = useReducer(noteReducer, initialState);
  const { notes } = useStore(selectActions);
  const [isExpanded, setIsExpanded] = useState(false);
  const colorValue = getColorValue(state.colorId);

  const handleCreate = () => {
    if (!state.title && !state.content) {
      dispatch({ type: 'RESET' });
      setIsExpanded(false);
      return;
    }
    notes.add(state);
    dispatch({ type: 'RESET' });
    setIsExpanded(false);
  };

  const handleClose = () => {
    dispatch({ type: 'RESET' });
    setIsExpanded(false);
  };

  useClickOutside({ elementRef, onClickOutside: handleCreate });

  return (
    <div
      ref={elementRef}
      className={cn(
        'bg-base relative flex w-full flex-col gap-4 rounded-lg border p-3.5 shadow-[0_1px_7px_rgba(0,0,0,0.8)] transition-colors duration-200 ease-in-out',
        className,
      )}
      onClick={onClick}
      style={{
        maxWidth: `${NOTE_WIDTH_EXPANDED}px`,
        backgroundColor: colorValue ?? 'var(--color-base)',
        borderColor: colorValue ?? 'var(--color-secondary)',
      }}
    >
      {isExpanded && (
        <>
          <TextEdit
            isTitle
            value={state.title}
            onChange={(value) => dispatch({ type: 'SET_TITLE', payload: value })}
            placeholder="Title"
          />

          <IconButton
            size={24}
            iconName="push_pin"
            label={state.isPinned ? 'Unpin note' : 'Pin note'}
            filled={state.isPinned}
            className="absolute top-2 right-2 p-1"
            iconClassName="text-neutral-300"
            onClick={() => dispatch({ type: 'TOGGLE_PINNED' })}
          />
        </>
      )}
      <TextEdit
        onFocus={() => setIsExpanded(true)}
        value={state.content}
        placeholder="Take a note..."
        onChange={(value) => dispatch({ type: 'SET_CONTENT', payload: value })}
      />
      {isExpanded && (
        <>
          {state.labels.length > 0 && (
            <div className="flex gap-1.5">
              {state.labels.map((label) => (
                <Label
                  key={label.id}
                  label={label}
                  onClose={() => dispatch({ type: 'REMOVE_LABEL', payload: label.id })}
                />
              ))}
            </div>
          )}
          <CreateToolbar state={state} dispatch={dispatch} />
          <button
            onClick={handleClose}
            className="absolute right-4 bottom-2 cursor-pointer rounded px-6 py-1.5 text-sm font-medium text-neutral-200 transition-colors duration-150 ease-in-out hover:bg-white/4"
            type="button"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
};

export default NoteCreate;
