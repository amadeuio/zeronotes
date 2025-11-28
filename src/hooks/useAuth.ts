import { authApi, type LoginRequest, type RegisterRequest } from '@/api';
import { selectActions, useStore } from '@/store';

export const useAuth = () => {
  const actions = useStore(selectActions);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    localStorage.setItem('token', response.token);
    actions.auth.set({ token: response.token, user: response.user, isAuthenticated: true });
  };

  const register = async (credentials: RegisterRequest) => {
    const response = await authApi.register(credentials);
    localStorage.setItem('token', response.token);
    actions.auth.set({ token: response.token, user: response.user, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    actions.auth.clear();
  };

  const initialize = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const user = await authApi.me(token);
      actions.auth.set({ user, token, isAuthenticated: true });
    } catch (err) {
      localStorage.removeItem('token');
      actions.auth.clear();
    }
  };

  return {
    login,
    register,
    logout,
    initialize,
  };
};
