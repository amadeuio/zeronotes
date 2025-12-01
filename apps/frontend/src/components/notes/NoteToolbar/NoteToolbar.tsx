import { IconButton, Menu, MenuTrigger } from '@/components';
import { COLORS } from '@/constants';
import { useNotes } from '@/hooks';
import type { DisplayNote } from '@/types';
import { cn } from '@/utils';
import { useState, type ReactNode } from 'react';
import BackgroundMenu from '../BackgroundMenu';
import EditLabelsMenu from './EditLabelsMenu';

interface MoreMenuProps {
  note: DisplayNote;
  children: ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
}

const MoreMenu = ({ note, children, onOpenChange }: MoreMenuProps) => {
  const { trash } = useNotes();
  const [isEditLabel, setIsEditLabel] = useState(false);

  return (
    <MenuTrigger
      recalculateOverflowCorrection={isEditLabel}
      onOpenChange={(isOpen) => {
        if (!isOpen) setIsEditLabel(false);
        onOpenChange?.(isOpen);
      }}
      menu={
        isEditLabel ? (
          <EditLabelsMenu note={note} />
        ) : (
          <Menu
            items={[
              {
                label: 'Delete note',
                action: () => trash(note.id),
              },
              {
                label: note.labels.length > 0 ? 'Change labels' : 'Add label',
                action: () => setIsEditLabel(true),
              },
            ]}
          />
        )
      }
    >
      {children}
    </MenuTrigger>
  );
};

interface NoteToolbarProps {
  note: DisplayNote;
  className?: string;
  onMenuOpenChange?: (isOpen: boolean) => void;
}

const NoteToolbar = ({ note, className, onMenuOpenChange }: NoteToolbarProps) => {
  const { restore, remove, update } = useNotes();

  return (
    <div className={cn('flex items-center', className)}>
      {note.isTrashed ? (
        <>
          <IconButton
            className="p-2"
            iconClassName="text-neutral-300"
            size={18}
            label="Restore"
            iconName="restore_from_trash"
            onClick={() => restore(note.id)}
          />
          <IconButton
            className="p-2"
            iconClassName="text-neutral-300"
            size={18}
            label="Delete forever"
            iconName="delete_forever"
            onClick={() => remove(note.id)}
          />
        </>
      ) : (
        <>
          <MenuTrigger
            menu={
              <BackgroundMenu
                colors={COLORS}
                selectedColorId={note.colorId}
                onColorClick={(color) => update(note.id, { colorId: color.id })}
              />
            }
            onOpenChange={onMenuOpenChange}
          >
            <IconButton
              className="p-2"
              iconClassName="text-neutral-300"
              size={18}
              label="Background options"
              iconName="palette"
            />
          </MenuTrigger>
          <IconButton
            className="p-2"
            iconClassName="text-neutral-300"
            size={18}
            label={note.isArchived ? 'Unarchive' : 'Archive'}
            iconName="archive"
            filled={note.isArchived}
            onClick={() => update(note.id, { isArchived: !note.isArchived })}
          />
          <MoreMenu note={note} onOpenChange={onMenuOpenChange}>
            <IconButton
              className="p-2"
              iconClassName="text-neutral-300"
              size={18}
              label="More"
              iconName="more_vert"
            />
          </MoreMenu>
        </>
      )}
    </div>
  );
};

export default NoteToolbar;
