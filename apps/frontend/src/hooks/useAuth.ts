import { authApi } from '@/api';
import { createEncryption, deriveKEK, setDataKey, unwrapDataKey } from '@/crypto';
import { selectActions, selectAuth, useStore } from '@/store';
import type { LoginBody, RegisterBody } from '@zeronotes/shared';

export const useAuth = () => {
  const actions = useStore(selectActions);
  const { encryption } = useStore(selectAuth);

  const login = async (credentials: LoginBody) => {
    const response = await authApi.login(credentials);

    const kek = await deriveKEK(
      credentials.password,
      response.encryption.salt,
      response.encryption.kdfIterations,
    );
    const dataKey = await unwrapDataKey(response.encryption.wrappedDataKey, kek);

    setDataKey(dataKey);

    localStorage.setItem('token', response.token);
    actions.auth.set({
      token: response.token,
      user: response.user,
      encryption: response.encryption,
      isAuthenticated: true,
      isUnlocked: true,
    });
  };

  const register = async (credentials: Omit<RegisterBody, 'encryption'>) => {
    const { encryption, dataKey } = await createEncryption(credentials.password);
    const response = await authApi.register({ ...credentials, encryption });

    setDataKey(dataKey);

    localStorage.setItem('token', response.token);
    actions.auth.set({
      token: response.token,
      user: response.user,
      encryption: response.encryption,
      isAuthenticated: true,
      isUnlocked: true,
    });
  };

  const unlock = async (password: string) => {
    if (!encryption) {
      throw new Error('Encryption not found');
    }

    const kek = await deriveKEK(password, encryption.salt, encryption.kdfIterations);
    const dataKey = await unwrapDataKey(encryption.wrappedDataKey, kek);

    setDataKey(dataKey);
    actions.auth.set({ isUnlocked: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    actions.auth.clear();
    setDataKey(null);
  };

  return {
    login,
    register,
    unlock,
    logout,
  };
};
