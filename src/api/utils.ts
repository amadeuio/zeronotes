import type { Store } from '@/store';

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const toSnakeCase = <T>(obj: T): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item));
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = toSnakeCase(value);
    }
    return result;
  }

  return obj;
};

export const toCamelCase = <T>(obj: T): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key);
      result[camelKey] = toCamelCase(value);
    }
    return result;
  }

  return obj;
};

export const withApiStatus = <T extends Record<string, (...args: any[]) => Promise<any>>>(
  api: T,
  actions: Store['actions'],
): T => {
  const wrapWithStatus = async <R>(apiCall: () => Promise<R>): Promise<R> => {
    actions.apiStatus.set({ loading: true, error: false });
    try {
      const result = await apiCall();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      actions.apiStatus.set({ loading: false, success: true });
      return result;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      actions.apiStatus.set({ loading: false, success: false, error: true });
      throw error;
    }
  };

  const wrapped = {} as T;
  for (const key in api) {
    const originalMethod = api[key];
    wrapped[key] = ((...args: any[]) => {
      return wrapWithStatus(() => originalMethod(...args));
    }) as T[typeof key];
  }
  return wrapped;
};
