import { authApi } from '@/api';
import { selectActions, useStore } from '@/store';
import {
  createEncryptionParamsForPassword,
  deriveKEKFromEncryption,
  setDataKey,
  unwrapDataKey,
} from '@/utils/crypto';
import type { LoginBody, RegisterBody } from '@zeronotes/shared';

export const useAuth = () => {
  const actions = useStore(selectActions);

  const login = async (credentials: LoginBody) => {
    const response = await authApi.login(credentials);
    // Derive KEK and unwrap the data key so we can decrypt notes/labels.
    const kek = await deriveKEKFromEncryption(credentials.password, response.encryption);
    const dataKey = await unwrapDataKey(response.encryption.wrappedDataKey, kek);
    setDataKey(dataKey);

    localStorage.setItem('token', response.token);
    actions.auth.set({ token: response.token, user: response.user, isAuthenticated: true });
  };

  const register = async (credentials: Omit<RegisterBody, 'encryption'>) => {
    const { encryption, dataKey } = await createEncryptionParamsForPassword(credentials.password);
    const response = await authApi.register({ ...credentials, encryption });

    // Use the locally generated data key for this session.
    setDataKey(dataKey);

    localStorage.setItem('token', response.token);
    actions.auth.set({ token: response.token, user: response.user, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    actions.auth.clear();
    setDataKey(null);
  };

  return {
    login,
    register,
    logout,
  };
};
