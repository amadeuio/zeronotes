import App from '@/App';
import LoginPage from '@/components/auth/LoginPage';
import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({
      to: '/notes',
    });
  },
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

export const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  component: App,
});
