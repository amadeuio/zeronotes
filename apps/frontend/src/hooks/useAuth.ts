import { authApi } from '@/api';
import { createEncryption, deriveKEK, setDataKey, unwrapDataKey } from '@/crypto';
import { selectActions, selectAuth, useStore } from '@/store';
import type { LoginBody, RegisterBody } from '@zeronotes/shared';

export const useAuth = () => {
  const actions = useStore(selectActions);
  const auth = useStore(selectAuth);

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
    actions.auth.login({
      token: response.token,
      user: response.user,
      encryption: response.encryption,
    });
  };

  const register = async (credentials: Omit<RegisterBody, 'encryption'>) => {
    const { encryption, dataKey } = await createEncryption(credentials.password);
    const response = await authApi.register({ ...credentials, encryption });

    setDataKey(dataKey);

    localStorage.setItem('token', response.token);
    actions.auth.register({
      token: response.token,
      user: response.user,
      encryption: response.encryption,
    });
  };

  const unlock = async (password: string) => {
    if (!auth.encryption) {
      throw new Error('Encryption not found');
    }

    const kek = await deriveKEK(password, auth.encryption.salt, auth.encryption.kdfIterations);
    const dataKey = await unwrapDataKey(auth.encryption.wrappedDataKey, kek);

    setDataKey(dataKey);
    actions.auth.unlock();
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
