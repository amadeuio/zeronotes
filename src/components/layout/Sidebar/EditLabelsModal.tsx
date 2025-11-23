import { IconButton } from '@/components';
import { selectActions, selectLabels, useStore } from '@/store';
import { cn } from '@/utils';
import { useState } from 'react';

interface LabelInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClick?: () => void;
}

const LabelInput = ({ value, onChange, placeholder, className, onClick }: LabelInputProps) => (
  <input
    type="text"
    placeholder={placeholder}
    maxLength={30}
    className={cn(
      'truncate border-none bg-transparent text-white outline-none focus:shadow-[0_1px_0_0_oklch(55.6%_0_0)]',
      className,
    )}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onClick={onClick}
  />
);

const CreateLabel = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const { labels } = useStore(selectActions);

  const handleSave = () => {
    if (name.trim()) {
      labels.create(name.trim());
      setName('');
      setIsEditing(false);
    }
  };

  return (
    <div className="flex cursor-text justify-between text-white">
      <div className="flex items-center gap-x-2">
        {isEditing ? (
          <IconButton
            iconName="close"
            label="Label"
            size={18}
            onClick={() => {
              setIsEditing(false);
              setName('');
            }}
          />
        ) : (
          <IconButton
            iconName="add"
            label="Label"
            size={18}
            onClick={() => {
              setIsEditing(true);
            }}
          />
        )}
        <LabelInput
          value={name}
          onChange={setName}
          onClick={() => setIsEditing(true)}
          placeholder="Enter label name"
        />
      </div>
      <IconButton
        className={cn('size-9.5 opacity-0', isEditing && 'opacity-100')}
        iconName="check"
        label="Save"
        size={18}
        onClick={handleSave}
      />
    </div>
  );
};

interface EditLabelProps {
  id: string;
  name: string;
}

const EditLabel = ({ id, name }: EditLabelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelName, setLabelName] = useState(name);
  const { labels } = useStore(selectActions);

  const handleSave = () => {
    if (labelName.trim()) {
      labels.edit(id, labelName.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="flex cursor-text justify-between text-white">
      <div className="flex items-center gap-x-2">
        <IconButton iconName="label" label="Label" size={18} />
        <LabelInput
          value={labelName}
          onChange={setLabelName}
          onClick={() => setIsEditing(true)}
          placeholder="Enter label name"
        />
      </div>
      <div className="flex items-center">
        {isEditing ? (
          <IconButton
            className="size-9.5"
            iconName="check"
            label="Save"
            size={18}
            onClick={handleSave}
          />
        ) : (
          <IconButton
            className="size-9.5"
            iconName="edit"
            label="Edit"
            size={18}
            onClick={() => setIsEditing(true)}
          />
        )}
        <IconButton iconName="delete" label="Delete" size={18} onClick={() => labels.remove(id)} />
      </div>
    </div>
  );
};

interface EditLabelsModalProps {
  onClose: () => void;
}

const EditLabelsModal = ({ onClose }: EditLabelsModalProps) => {
  const labels = useStore(selectLabels);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="shadow-base flex w-80 flex-col gap-y-4 rounded-lg bg-neutral-800 p-4"
      >
        <span className="pl-1 text-lg font-semibold">Edit labels</span>
        <div className="space-y-2">
          <CreateLabel />
          {labels.map((label) => (
            <EditLabel key={label.id} id={label.id} name={label.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditLabelsModal;
