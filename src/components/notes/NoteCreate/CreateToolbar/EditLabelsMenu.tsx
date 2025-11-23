import { Icon } from '@/components';
import { selectActions, useSelectFilteredLabels, useStore } from '@/store';
import type { DraftNote, Label } from '@/types';
import { useState, type Dispatch } from 'react';
import type { NoteAction } from '../reducer';

interface CheckboxProps {
  checked: boolean;
}

const Checkbox = ({ checked }: CheckboxProps) => (
  <div className="relative size-[12px] flex-shrink-0 rounded-xs border border-neutral-300">
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
      onClick={onClick}
      className="flex cursor-pointer items-center gap-x-2 py-2 break-all text-white hover:bg-neutral-600"
    >
      <Icon name="add" />
      Create '{name}'
    </div>
  );
};

interface MenuItemProps {
  state: DraftNote;
  dispatch: Dispatch<NoteAction>;
  label: Label;
}

const MenuItem = ({ state, dispatch, label }: MenuItemProps) => {
  const isChecked = state.labels.some((l) => l.id === label.id);

  const handleClick = () => {
    if (isChecked) {
      dispatch({ type: 'REMOVE_LABEL', payload: label.id });
    } else {
      dispatch({ type: 'ADD_LABEL', payload: label });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer items-center gap-x-4 py-2 break-all text-white hover:bg-neutral-600"
    >
      <Checkbox checked={isChecked} />
      {label.name}
    </div>
  );
};

export interface EditLabelsMenuProps {
  state: DraftNote;
  dispatch: Dispatch<NoteAction>;
}

const EditLabelsMenu = ({ state, dispatch }: EditLabelsMenuProps) => {
  const [search, setSearch] = useState('');
  const filteredLabels = useSelectFilteredLabels(search);
  const { labels } = useStore(selectActions);

  const handleCreateLabel = () => {
    const newLabel = labels.create(search);
    dispatch({ type: 'ADD_LABEL', payload: newLabel });
    setSearch('');
  };

  return (
    <div className="shadow-base w-56 rounded-sm bg-neutral-700 py-2 text-sm [&>*]:px-4">
      <span>Label note</span>
      <Input value={search} onChange={setSearch} />
      {filteredLabels.length > 0 ? (
        filteredLabels.map((label) => (
          <MenuItem key={label.id} state={state} dispatch={dispatch} label={label} />
        ))
      ) : (
        <CreateLabel name={search} onClick={handleCreateLabel} />
      )}
    </div>
  );
};

export default EditLabelsMenu;
