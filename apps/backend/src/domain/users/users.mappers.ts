import { User } from './users.schemas';
import { UserRow } from './users.types';

export const userMappers = {
  rowToUser: (row: UserRow): User => ({
    id: row.id,
    email: row.email,
  }),
};
