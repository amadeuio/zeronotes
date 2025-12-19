import logo from '@/assets/logo.png';
import { Icon, IconButton, Input, Spinner } from '@/components';
import { useAuth } from '@/hooks';
import { selectActions, selectApiStatus, selectFiltersSearch, selectUser, useStore } from '@/store';
import { cn } from '@/utils';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

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

interface ApiStatusProps {
  loading: boolean;
  error: boolean;
}

const ApiStatus = ({ loading, error }: ApiStatusProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      {loading ? (
        <Spinner className="p-3" />
      ) : error ? (
        <Icon name="error" className="p-3 text-neutral-400" size={24} />
      ) : (
        <Icon name="cloud_done" className="p-3 text-neutral-400" size={24} />
      )}
      {isTooltipVisible && (
        <div className="absolute top-full left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded bg-neutral-700 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg">
          {loading ? 'Syncing...' : error ? 'Sync failed' : 'Synced'}
        </div>
      )}
    </div>
  );
};

const User = () => {
  const user = useStore(selectUser);

  return (
    <IconButton
      iconName="person"
      label={
        <div className="flex flex-col gap-1 text-left">
          {user?.name && <span>{user.name}</span>}
          {user?.email && <span className="text-neutral-400">{user.email}</span>}
        </div>
      }
      size={24}
    />
  );
};

const Navbar = () => {
  const actions = useStore(selectActions);
  const search = useStore(selectFiltersSearch);
  const { loading, error } = useStore(selectApiStatus);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

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
      <div className="flex items-center gap-x-2">
        <ApiStatus loading={loading} error={error} />
        <IconButton iconName="settings" label="Settings" size={24} className="hidden md:flex" />
        <IconButton iconName="logout" label="Logout" size={24} onClick={handleLogout} />
        <User />
      </div>
    </nav>
  );
};

export default Navbar;
