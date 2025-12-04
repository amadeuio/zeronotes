import App from '@/App';
import Login from '@/components/auth/Login';
import Unlock from '@/components/auth/Unlock';
import { useStore } from '@/store';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';

export const rootRoute = createRootRoute({
  beforeLoad: async ({ location }) => {
    const { isAuthenticated, isUnlocked } = useStore.getState().auth;
    const currentPath = location.pathname;

    if (!isAuthenticated && currentPath !== '/login') {
      throw redirect({ to: '/login' });
    }

    if (isAuthenticated && currentPath === '/login') {
      throw redirect({ to: '/' });
    }

    if (isAuthenticated && !isUnlocked && currentPath !== '/unlock') {
      throw redirect({ to: '/unlock' });
    }
  },
  component: () => <Outlet />,
});

const unlockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/unlock',
  component: Unlock,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

const routeTree = rootRoute.addChildren([unlockRoute, loginRoute, notesRoute]);

export const router = createRouter({ routeTree });
