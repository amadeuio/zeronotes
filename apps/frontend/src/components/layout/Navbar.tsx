import logo from '@/assets/logo.png';
import { Icon, IconButton, Input, Spinner } from '@/components';
import { useAuth } from '@/hooks';
import { selectActions, selectApiStatus, selectFiltersSearch, useStore } from '@/store';
import { cn } from '@/utils';
import { useNavigate } from '@tanstack/react-router';

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

const ApiStatus = ({ loading, error }: ApiStatusProps) =>
  loading ? (
    <Spinner className="p-3" />
  ) : error ? (
    <Icon name="error" className="p-3 text-neutral-400" size={24} />
  ) : (
    <Icon name="cloud_done" className="p-3 text-neutral-400" size={24} />
  );

const Label = () => (
  <div className="flex flex-col gap-1 text-left">
    <span>Zeronotes</span>
    <span className="text-neutral-400">by amadeu.io</span>
  </div>
);

const User = () => (
  <a href="https://github.com/amadeuio" target="_blank" rel="noopener noreferrer">
    <IconButton iconName="person" label={<Label />} size={24} />
  </a>
);

const Navbar = () => {
  const actions = useStore(selectActions);
  const search = useStore(selectFiltersSearch);
  const apiStatus = useStore(selectApiStatus);
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
        <ApiStatus loading={apiStatus.loading} error={apiStatus.error} />
        <IconButton iconName="settings" label="Settings" size={24} className="hidden md:flex" />
        <IconButton iconName="logout" label="Logout" size={24} onClick={handleLogout} />
        <User />
      </div>
    </nav>
  );
};

export default Navbar;
