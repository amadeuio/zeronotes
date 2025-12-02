import { AuthResponse, LoginBody, RegisterBody, User } from '@zeronotes/shared';
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
    // NOTE: encryption fields are accepted at the API/schema level but
    // actual key generation/wrapping will be handled on the frontend.
    // For now we simply persist whatever the client sends (or nulls).
    const passwordHash = await hashPassword(data.password);

    const userId = uuidv4();
    const user = await userRepository.create(
      userId,
      data.email,
      passwordHash,
      data.encryption?.salt ?? null,
      data.encryption?.wrappedDataKey ?? null,
      data.encryption?.kdfIterations ?? null,
      data.encryption?.version ?? null,
    );

    const token = await createToken(user.id);

    return {
      user: userMappers.rowToUser(user),
      token,
      encryption: {
        salt: user.encryption_salt ?? '',
        wrappedDataKey: user.wrapped_data_key ?? '',
        kdfIterations: user.kdf_iterations ?? 0,
        version: user.encryption_version ?? 1,
      },
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
      encryption: {
        salt: user.encryption_salt ?? '',
        wrappedDataKey: user.wrapped_data_key ?? '',
        kdfIterations: user.kdf_iterations ?? 0,
        version: user.encryption_version ?? 1,
      },
    };
  },

  findById: async (id: string): Promise<User | null> => {
    const user = await userRepository.findById(id);
    return user ? userMappers.rowToUser(user) : null;
  },
};
