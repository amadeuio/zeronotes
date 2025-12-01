import App from '@/App';
import Login from '@/components/auth/Login';
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
    const { isAuthenticated } = useStore.getState().auth;
    const currentPath = location.pathname;

    if (!isAuthenticated && currentPath !== '/login') {
      throw redirect({ to: '/login' });
    }

    if (isAuthenticated && currentPath === '/login') {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Outlet />,
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

const routeTree = rootRoute.addChildren([loginRoute, notesRoute]);

export const router = createRouter({ routeTree });
