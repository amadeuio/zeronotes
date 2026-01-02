import type { AuthResponse, LoginBody, MeResponse, RegisterBody } from '@zeronotes/shared';
import { api } from './utils';

export const authApi = {
  register: (credentials: RegisterBody): Promise<AuthResponse> =>
    api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      trackStatus: false,
    }),

  login: (credentials: LoginBody): Promise<AuthResponse> =>
    api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      trackStatus: false,
    }),

  me: (token: string): Promise<MeResponse> =>
    api<MeResponse>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      trackStatus: false,
    }),
};
