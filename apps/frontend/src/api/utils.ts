import { useStore } from '@/store';
import { getErrorMessage } from '@/utils';
import { API_URL } from './constants';

export interface ApiOptions extends RequestInit {
  trackStatus?: boolean;
}

export const api = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const { trackStatus = true, ...fetchOptions } = options;
  const actions = useStore.getState().actions;

  if (trackStatus) {
    actions.api.set({ loading: true, error: null });
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw errorBody;
    }

    if (trackStatus) {
      actions.api.set({ loading: false });
    }

    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return {} as T;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (trackStatus) {
      actions.api.set({ loading: false, error: getErrorMessage(error) });
    }
    throw error;
  }
};

export const apiAuth = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const token = useStore.getState().auth.token;

  return api<T>(path, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
