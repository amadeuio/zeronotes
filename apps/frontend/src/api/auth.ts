import { api } from '@/utils';
import type { AuthResponse, LoginBody, MeResponse, RegisterBody } from '@zeronotes/shared';

export const authApi = {
  register: (credentials: RegisterBody): Promise<AuthResponse> =>
    api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      trackStatus: false,
    }),

  login: (credentials: LoginBody): Promise<AuthResponse> =>
    api('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      trackStatus: false,
    }),

  me: (token: string): Promise<MeResponse> =>
    api('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      trackStatus: false,
    }),
};
