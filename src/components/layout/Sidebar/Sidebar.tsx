import { Icon } from '@/components';
import { selectActions, selectFiltersView, selectLabels, selectUi, useStore } from '@/store';
import { cn } from '@/utils';

interface SidebarItemProps {
  title: string;
  url: string;
  iconName: string;
  onClick?: () => void;
  isActive?: boolean;
  isCollapsed?: boolean;
}

const SidebarItem = ({
  title,
  url,
  iconName,
  onClick,
  isActive,
  isCollapsed,
}: SidebarItemProps) => (
  <a
    href={url}
    className={cn(
      'transition-width flex items-center gap-x-8 overflow-hidden rounded-full py-3 text-sm font-[500] duration-100 ease-in-out',
      isActive ? 'bg-[#41331c]' : 'hover:bg-white/6',
      isCollapsed
        ? 'mx-2.75 w-12 pl-3.25 group-hover:mx-0 group-hover:w-70 group-hover:rounded-l-none group-hover:pl-6'
        : 'w-70 rounded-l-none pl-6',
    )}
    onClick={onClick}
  >
    <Icon size={24} name={iconName} className={cn(isActive && 'text-neutral-100')} />
    <span className="whitespace-nowrap">{title}</span>
  </a>
);

interface SidebarProps {
  isMobile: boolean;
}

const Sidebar = ({ isMobile }: SidebarProps) => {
  const labels = useStore(selectLabels);
  const view = useStore(selectFiltersView);
  const { filters, ui } = useStore(selectActions);
  const { isSidebarCollapsed } = useStore(selectUi);

  return (
    <aside
      className={cn(
        'group bg-base fixed left-0 z-10 flex h-full flex-col py-2',
        isSidebarCollapsed
          ? 'hover:shadow-[2px_0_6px_-2px_rgba(0,0,0,0.6)]'
          : isMobile && 'shadow-[2px_0_6px_-2px_rgba(0,0,0,0.6)]',
      )}
    >
      <SidebarItem
        title="Notes"
        url="#"
        iconName="lightbulb_2"
        onClick={() => filters.set({ view: { type: 'notes' } })}
        isActive={view.type === 'notes'}
        isCollapsed={isSidebarCollapsed}
      />
      {labels.map((label) => (
        <SidebarItem
          key={label.id}
          title={label.name}
          url="#"
          iconName="label"
          onClick={() => filters.set({ view: { type: 'label', id: label.id } })}
          isActive={view.type === 'label' && view.id === label.id}
          isCollapsed={isSidebarCollapsed}
        />
      ))}
      <SidebarItem
        title="Edit labels"
        url="#"
        iconName="edit"
        onClick={() => ui.setEditLabelsMenuOpen(true)}
        isCollapsed={isSidebarCollapsed}
      />
      <SidebarItem
        title="Archive"
        url="#"
        iconName="archive"
        onClick={() => filters.set({ view: { type: 'archive' } })}
        isActive={view.type === 'archive'}
        isCollapsed={isSidebarCollapsed}
      />
      <SidebarItem
        title="Trash"
        url="#"
        iconName="delete"
        onClick={() => filters.set({ view: { type: 'trash' } })}
        isActive={view.type === 'trash'}
        isCollapsed={isSidebarCollapsed}
      />
    </aside>
  );
};

export default Sidebar;
