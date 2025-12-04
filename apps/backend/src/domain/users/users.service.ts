import { AuthResponse, Encryption, LoginBody, RegisterBody, User } from '@zeronotes/shared';
import { v4 as uuidv4 } from 'uuid';
import { AuthError, ConflictError } from '../../utils/AppError';
import { hashPassword, verifyPassword } from '../../utils/crypto';
import { createToken } from '../../utils/jwt';
import { userMappers } from './users.mappers';
import { userRepository } from './users.repository';

export const userService = {
  register: async (data: RegisterBody): Promise<AuthResponse> => {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }
    const passwordHash = await hashPassword(data.password);

    const userId = uuidv4();
    const user = await userRepository.create(userId, data.email, passwordHash, data.encryption);

    const token = await createToken(user.id);

    return {
      user: userMappers.rowToUser(user),
      token,
      encryption: userMappers.rowToEncryption(user),
    };
  },

  login: async (data: LoginBody): Promise<AuthResponse> => {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const isValid = await verifyPassword(user.password_hash, data.password);
    if (!isValid) {
      throw new AuthError('Invalid credentials');
    }

    const token = await createToken(user.id);

    return {
      user: userMappers.rowToUser(user),
      token,
      encryption: userMappers.rowToEncryption(user),
    };
  },

  findById: async (id: string): Promise<{ user: User; encryption: Encryption } | null> => {
    const user = await userRepository.findById(id);
    if (!user) {
      return null;
    }
    return {
      user: userMappers.rowToUser(user),
      encryption: userMappers.rowToEncryption(user),
    };
  },
};
