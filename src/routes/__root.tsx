import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router';
import { indexRoute, loginRoute, notesRoute } from './index';

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, notesRoute]);

export const router = createRouter({ routeTree });
