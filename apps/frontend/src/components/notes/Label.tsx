import { IconButton } from '@/components';
import type { Label as LabelType } from '@/types';

interface LabelProps {
  label: LabelType;
  onClick?: () => void;
  onClose?: () => void;
}

const Label = ({ label, onClick, onClose }: LabelProps) => (
  <div
    className="group/label relative min-w-12 cursor-pointer rounded-full border-[1.3px] border-white/25 px-2.5 py-0.5 text-[11px]"
    onClick={onClick}
  >
    <div className="truncate group-hover/label:w-4/5">{label.name}</div>
    <IconButton
      label="Remove label"
      iconName="close"
      size={11}
      className="absolute top-[4px] right-[2px] p-[2px] opacity-0 group-hover/label:opacity-100"
      onClick={onClose}
    />
  </div>
);

export default Label;
