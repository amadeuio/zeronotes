import logo from '@/assets/logo.png';
import { Icon, IconButton, Input, Menu, Spinner } from '@/components';
import { useAuth, useClickOutside } from '@/hooks';
import { selectActions, selectApiStatus, selectFiltersSearch, selectUser, useStore } from '@/store';
import { cn, getUserInitials } from '@/utils';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  className?: string;
}

const Search = ({ value, onChange, onClear, className }: SearchProps) => (
  <div className={cn('relative flex w-full max-w-[720px]', className)}>
    <Input
      type="text"
      placeholder="Search"
      className="bg-white/14 hover:bg-white/18"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <IconButton
      onClick={onClear}
      label="Clear"
      iconName="clear"
      size={20}
      className={cn(
        'absolute top-1/2 right-1 -translate-y-1/2 p-2 transition-opacity duration-150 ease-in-out',
        value.trim() ? 'opacity-100' : 'opacity-0',
      )}
    />
  </div>
);

interface SyncStatusProps {
  loading: boolean;
  error: string | null;
}

const SyncStatus = ({ loading, error }: SyncStatusProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      {loading ? (
        <Spinner className="-translate-x-[13px] translate-y-[2px]" thickness={5} size={22} />
      ) : error ? (
        <Icon name="error" className="p-3 text-neutral-400" size={24} />
      ) : (
        <Icon name="cloud_done" className="p-3 text-neutral-400" size={24} />
      )}
      {isTooltipVisible && (
        <div className="absolute top-full left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded bg-neutral-700 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg">
          {loading ? 'Syncing...' : error ? error : 'Synced'}
        </div>
      )}
    </div>
  );
};

const User = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = useStore(selectUser);
  const initials = user ? getUserInitials(user.name, user.email) : 'N/A';
  const elementRef = useRef<HTMLDivElement>(null);
  useClickOutside({ elementRef, onClickOutside: () => setIsMenuOpen(false) });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative" ref={elementRef}>
      <div
        className="text-md flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/14 text-neutral-400 transition-colors duration-150 ease-in-out hover:bg-white/18"
        onClick={() => {
          setIsTooltipVisible(false);
          setIsMenuOpen((prev) => !prev);
        }}
        onMouseEnter={() => {
          if (!isMenuOpen) setIsTooltipVisible(true);
        }}
        onMouseLeave={() => {
          if (!isMenuOpen) setIsTooltipVisible(false);
        }}
      >
        {initials}
      </div>
      {isTooltipVisible && (
        <div className="absolute top-full right-0 z-30 translate-y-1 rounded bg-neutral-700 px-2 py-1 text-xs text-white shadow-lg">
          <div className="flex flex-col gap-1 text-left">
            {user?.name && <span>{user.name}</span>}
            {user?.email && <span className="text-neutral-400">{user.email}</span>}
          </div>
        </div>
      )}
      {isMenuOpen && (
        <Menu
          className="absolute top-full right-0 z-30 translate-y-1"
          items={[
            {
              label: 'Log out',
              action: () => {
                logout();
                navigate({ to: '/login' });
              },
            },
          ]}
        />
      )}
    </div>
  );
};

const Navbar = () => {
  const actions = useStore(selectActions);
  const search = useStore(selectFiltersSearch);
  const { loading, error } = useStore(selectApiStatus);

  return (
    <nav className="flex h-16 justify-between border-b px-3 py-2">
      <div className="flex flex-1 items-center">
        <IconButton
          iconName="menu"
          iconClassName="text-color-primary"
          label="Main menu"
          size={24}
          onClick={() => actions.ui.toggleSidebar()}
        />
        <div className="mr-22 ml-2 hidden items-center gap-x-2 md:flex">
          <img src={logo} alt="Keep logo" className="size-10" />
          <div className="text-[20px]">Zeronotes</div>
        </div>
        <Search
          value={search}
          onChange={(value) => actions.filters.set({ search: value })}
          onClear={() => actions.filters.set({ search: '' })}
          className="mx-4 md:mx-0"
        />
      </div>
      <div className="flex items-center gap-x-3">
        <SyncStatus loading={loading} error={error} />
        <User />
      </div>
    </nav>
  );
};

export default Navbar;
