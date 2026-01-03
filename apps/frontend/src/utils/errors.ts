import { errorSchema } from '@zeronotes/shared';

export const getErrorMessage = (err: unknown): string => {
  const result = errorSchema.safeParse(err);

  if (result.success) {
    return result.data.error.message;
  }

  // Fallback for network errors or generic JS errors
  if (err instanceof Error) return err.message;

  // Handle case where error might be a string already
  if (typeof err === 'string') return err;

  return 'An unexpected error occurred';
};
