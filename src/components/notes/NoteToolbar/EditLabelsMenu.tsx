import { Icon } from '@/components';
import { selectActions, useSelectFilteredLabels, useSelectNoteHasLabel, useStore } from '@/store';
import type { DisplayNote, Label } from '@/types';
import { useState } from 'react';

interface CheckboxProps {
  checked: boolean;
}

const Checkbox = ({ checked }: CheckboxProps) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className="relative size-[12px] flex-shrink-0 rounded-xs border border-neutral-300"
  >
    {checked && (
      <Icon name="check" size={12} className="absolute top-0 -left-[1px] text-neutral-300" />
    )}
  </div>
);

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

const Input = ({ value, onChange }: InputProps) => (
  <div className="flex items-center gap-x-2">
    <input
      type="text"
      placeholder="Enter label name"
      maxLength={30}
      className="w-full border-none py-2 text-white outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
    <Icon name="search" size={14} className="text-neutral-400" />
  </div>
);

interface CreateLabelProps {
  name: string;
  onClick: () => void;
}

const CreateLabel = ({ name, onClick }: CreateLabelProps) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex cursor-pointer items-center gap-x-2 py-2 break-all text-white hover:bg-white/8"
    >
      <Icon name="add" />
      Create '{name}'
    </div>
  );
};

interface MenuItemProps {
  noteId: string;
  label: Label;
}

const MenuItem = ({ noteId, label }: MenuItemProps) => {
  const { notes } = useStore(selectActions);
  const isChecked = useSelectNoteHasLabel(noteId, label.id);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        notes.toggleLabel(noteId, label.id);
      }}
      className="flex cursor-pointer items-center gap-x-4 py-2 break-all text-white hover:bg-white/8"
    >
      <Checkbox checked={isChecked} />
      {label.name}
    </div>
  );
};

interface LabelNoteMenuProps {
  note: DisplayNote;
}

const EditLabelsMenu = ({ note }: LabelNoteMenuProps) => {
  const [search, setSearch] = useState('');
  const filteredLabels = useSelectFilteredLabels(search);
  const { labels } = useStore(selectActions);

  const handleCreateLabel = () => {
    labels.createAndAddToNote(search, note.id);
    setSearch('');
  };

  return (
    <div className="shadow-base w-56 rounded-sm bg-neutral-700 py-2 text-sm [&>*]:px-4">
      <span>Label note</span>
      <Input value={search} onChange={setSearch} />
      {filteredLabels.length > 0 ? (
        filteredLabels.map((label) => <MenuItem key={label.id} noteId={note.id} label={label} />)
      ) : (
        <CreateLabel name={search} onClick={handleCreateLabel} />
      )}
    </div>
  );
};

export default EditLabelsMenu;
