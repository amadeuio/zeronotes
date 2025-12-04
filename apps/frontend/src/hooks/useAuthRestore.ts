import { authApi } from '@/api';
import { selectActions, useStore } from '@/store';
import { useEffect, useState } from 'react';

export const useAuthRestore = () => {
  const [isLoading, setIsLoading] = useState(true);
  const actions = useStore(selectActions);

  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { user, encryption } = await authApi.me(token);
        actions.auth.set({ user, token, encryption, isAuthenticated: true, isUnlocked: false });
      } catch (err) {
        localStorage.removeItem('token');
        actions.auth.clear();
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  return { isLoading };
};
