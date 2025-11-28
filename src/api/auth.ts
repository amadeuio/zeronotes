import { API_URL } from './constants';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface MeResponse {
  id: string;
  email: string;
}

export const authApi = {
  register: async (credentials: RegisterRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      if (res.status === 409) {
        throw new Error('User already exists');
      }
      if (res.status === 400) {
        throw new Error('Email and password are required');
      }
      throw new Error('Failed to register user');
    }

    const data = await res.json();
    return data;
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Invalid credentials');
      }
      if (res.status === 400) {
        throw new Error('Email and password are required');
      }
      throw new Error('Failed to login');
    }

    const data = await res.json();
    return data;
  },

  me: async (token: string): Promise<MeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Unauthorized');
      }
      if (res.status === 404) {
        throw new Error('User not found');
      }
      throw new Error('Failed to get user');
    }

    const data = await res.json();
    return data;
  },
};
