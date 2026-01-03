import { errorSchema, type ErrorResponse } from '@zeronotes/shared';
import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('should extract message from standard backend error response', () => {
    const rawError = {
      error: {
        message: 'Invalid credentials',
        code: 'AUTH_ERROR',
        status: 401,
      },
    };

    const validatedError: ErrorResponse = errorSchema.parse(rawError);
    expect(getErrorMessage(validatedError)).toBe('Invalid credentials');
  });

  it('should extract message from backend error with details', () => {
    const rawError = {
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        details: [{ path: ['email'], message: 'Invalid email' }],
      },
    };

    const validatedError: ErrorResponse = errorSchema.parse(rawError);
    expect(getErrorMessage(validatedError)).toBe('Validation failed');
  });

  it('should return the message from a standard JS Error object', () => {
    const jsError = new Error('Network timeout');
    expect(getErrorMessage(jsError)).toBe('Network timeout');
  });

  it('should return the error if it is already a string', () => {
    const message = 'Something went wrong';
    expect(getErrorMessage(message)).toBe(message);
  });

  it('should handle non-standard objects with a fallback', () => {
    const weirdError = { some: 'random object' };
    expect(getErrorMessage(weirdError)).toBe('An unexpected error occurred');
  });

  it('should handle null or undefined with a fallback', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
  });
});
