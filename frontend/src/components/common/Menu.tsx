import { cn } from '@/utils';

export interface MenuItemType {
  label: string;
  action: () => void;
}

const MenuItem = ({ label, action }: MenuItemType) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      action();
    }}
    className="cursor-pointer px-6 py-2 whitespace-nowrap text-white hover:bg-white/8"
  >
    {label}
  </div>
);

interface MenuProps {
  items: MenuItemType[];
  className?: string;
}

const Menu = ({ items, className }: MenuProps) => (
  <div className={cn('bg-base shadow-base w-42 rounded-sm py-2 text-sm', className)}>
    {items.map((item) => (
      <MenuItem key={item.label} {...item} />
    ))}
  </div>
);

export default Menu;
