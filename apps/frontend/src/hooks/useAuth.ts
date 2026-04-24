import { authApi, labelsApi, notesApi } from '@/api';
import { createEncryption, deriveKEK, encryptString, setDataKey, unwrapDataKey } from '@/crypto';
import { selectActions, selectAuth, useStore } from '@/store';
import type { ErrorResponse, LoginBody, RegisterBody } from '@zeronotes/shared';

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
    const wasDemo = useStore.getState().auth.isDemo;
    const demoNotes = wasDemo ? Object.values(useStore.getState().notes.byId) : [];
    const demoLabels = wasDemo ? Object.values(useStore.getState().labels.byId) : [];

    const { encryption, dataKey } = await createEncryption(credentials.password);
    const response = await authApi.register({ ...credentials, encryption });

    setDataKey(dataKey);

    localStorage.setItem('token', response.token);
    actions.auth.register({
      token: response.token,
      user: response.user,
      encryption: response.encryption,
    });

    if (wasDemo) {
      await Promise.all(
        demoLabels.map(async (label) => {
          const encryptedLabel = {
            id: label.id,
            name: await encryptString(label.name, dataKey),
          };
          await labelsApi.create(encryptedLabel);
        }),
      );

      await Promise.all(
        demoNotes
          .filter((note) => !note.isTrashed)
          .map(async (note) => {
            const encryptedPayload = {
              id: note.id,
              title: await encryptString(note.title, dataKey),
              content: await encryptString(note.content, dataKey),
              colorId: note.colorId,
              isPinned: note.isPinned,
              isArchived: note.isArchived,
              labelIds: note.labelIds,
            };
            await notesApi.create(encryptedPayload);
          }),
      );
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
