import { authApi } from '@/api';
import { createEncryption, deriveKEK, setDataKey, unwrapDataKey } from '@/crypto';
import { selectActions, selectAuth, useStore } from '@/store';
import type { ErrorResponse, LoginBody, RegisterBody } from '@zeronotes/shared';
import { useLabels } from './useLabels';
import { useNotes } from './useNotes';

export const useAuth = () => {
  const actions = useStore(selectActions);
  const auth = useStore(selectAuth);
  const { uploadAllFromStore: uploadAllNotes } = useNotes();
  const { uploadAllFromStore: uploadAllLabels } = useLabels();

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
    const currentLabels = Object.values(useStore.getState().labels.byId);
    const currentNotes = Object.values(useStore.getState().notes.byId);

    const { encryption, dataKey } = await createEncryption(credentials.password);
    const response = await authApi.register({ ...credentials, encryption });

    setDataKey(dataKey);

    localStorage.setItem('token', response.token);
    actions.auth.register({
      token: response.token,
      user: response.user,
      encryption: response.encryption,
    });

    if (currentLabels.length > 0) {
      await uploadAllLabels();
    }

    if (currentNotes.length > 0) {
      await uploadAllNotes();
    }
  };

  const unlock = async (password: string) => {
    if (!auth.encryption) {
      throw new Error('Encryption not found');
    }

    try {
      const kek = await deriveKEK(password, auth.encryption.salt, auth.encryption.kdfIterations);
      const dataKey = await unwrapDataKey(auth.encryption.wrappedDataKey, kek);

      setDataKey(dataKey);

      actions.auth.unlock();
    } catch (err) {
      const unlockError: ErrorResponse = {
        error: {
          message: 'Incorrect password',
          code: 'INVALID_UNLOCK_PASSWORD',
          status: 401,
          details: err,
        },
      };
      throw unlockError;
    }
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
