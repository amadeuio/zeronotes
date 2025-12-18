import { AuthResponse, Encryption, LoginBody, RegisterBody, User } from '@zeronotes/shared';
import { v4 as uuidv4 } from 'uuid';
import { AuthError, ConflictError } from '../../utils/AppError';
import { hashPassword, verifyPassword } from '../../utils/crypto';
import { createToken } from '../../utils/jwt';
import { authMappers } from './auth.mappers';
import { authRepository } from './auth.repository';

export const authService = {
  register: async (data: RegisterBody): Promise<AuthResponse> => {
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }
    const passwordHash = await hashPassword(data.password);

    const userId = uuidv4();
    const user = await authRepository.create(
      userId,
      data.email,
      data.name,
      passwordHash,
      data.encryption,
    );

    const token = await createToken(user.id);

    return {
      user: authMappers.rowToUser(user),
      token,
      encryption: authMappers.rowToEncryption(user),
    };
  },

  login: async (data: LoginBody): Promise<AuthResponse> => {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const isValid = await verifyPassword(user.password_hash, data.password);
    if (!isValid) {
      throw new AuthError('Invalid credentials');
    }

    const token = await createToken(user.id);

    return {
      user: authMappers.rowToUser(user),
      token,
      encryption: authMappers.rowToEncryption(user),
    };
  },

  findById: async (id: string): Promise<{ user: User; encryption: Encryption } | null> => {
    const user = await authRepository.findById(id);
    if (!user) {
      return null;
    }
    return {
      user: authMappers.rowToUser(user),
      encryption: authMappers.rowToEncryption(user),
    };
  },
};
