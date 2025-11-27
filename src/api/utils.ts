import type { Store } from '@/store';

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const SEED_TOKEN = import.meta.env.VITE_SEED_TOKEN;
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${SEED_TOKEN}`);

  return fetch(url, {
    ...options,
    headers,
  });
};

export const withApiStatus = <T extends Record<string, (...args: any[]) => Promise<any>>>(
  api: T,
  actions: Store['actions'],
): T => {
  const wrapWithStatus = async <R>(apiCall: () => Promise<R>): Promise<R> => {
    actions.api.set({ loading: true, error: false });
    try {
      const result = await apiCall();
      actions.api.set({ loading: false });
      return result;
    } catch (error) {
      actions.api.set({ loading: false, error: true });
      throw error;
    }
  };

  const wrapped = {} as T;
  for (const key in api) {
    const originalMethod = api[key];
    wrapped[key] = ((...args: any[]) => {
      return wrapWithStatus(() => originalMethod(...args));
    }) as T[typeof key];
  }
  return wrapped;
};
