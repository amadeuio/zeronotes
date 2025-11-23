import { IconButton, Menu, MenuTrigger } from '@/components';
import { COLORS } from '@/constants';
import { selectActions, useStore, type Store } from '@/store';
import type { DisplayNote } from '@/types';
import { cn } from '@/utils';
import { useState, type ReactNode } from 'react';
import BackgroundMenu from '../BackgroundMenu';
import EditLabelsMenu from './EditLabelsMenu';

interface MoreMenuProps {
  note: DisplayNote;
  notes: Store['actions']['notes'];
  children: ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
}

const MoreMenu = ({ note, notes, children, onOpenChange }: MoreMenuProps) => {
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
                action: () => notes.trash(note.id),
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
  const { notes } = useStore(selectActions);

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
            onClick={() => notes.restore(note.id)}
          />
          <IconButton
            className="p-2"
            iconClassName="text-neutral-300"
            size={18}
            label="Delete forever"
            iconName="delete_forever"
            onClick={() => notes.remove(note.id)}
          />
        </>
      ) : (
        <>
          <MenuTrigger
            menu={
              <BackgroundMenu
                colors={COLORS}
                selectedColorId={note.colorId}
                onColorClick={(color) => notes.updateColor(note.id, color.id)}
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
            onClick={() => notes.toggleArchive(note.id)}
          />
          <MoreMenu note={note} notes={notes} onOpenChange={onMenuOpenChange}>
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
