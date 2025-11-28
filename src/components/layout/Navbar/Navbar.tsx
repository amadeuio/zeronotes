import logo from '@/assets/logo.png';
import { ApiStatus, IconButton } from '@/components';
import { useAuth } from '@/hooks';
import { selectActions, useStore } from '@/store';
import { useNavigate } from '@tanstack/react-router';
import Search from './Search';
import User from './User';

const Navbar = () => {
  const actions = useStore(selectActions);
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
        <Search className="mx-4 md:mx-0" />
      </div>
      <div className="flex items-center gap-x-2">
        <ApiStatus />
        <IconButton iconName="settings" label="Settings" size={24} className="hidden md:flex" />
        <IconButton iconName="logout" label="Logout" size={24} onClick={handleLogout} />
        <User />
      </div>
    </nav>
  );
};

export default Navbar;
