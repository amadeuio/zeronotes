import { Label } from '@zeronotes/shared';
import { LabelRow } from './labels.types';

export const labelMappers = {
  rowToLabel: (row: LabelRow): Label => ({
    id: row.id,
    name: row.name,
  }),
};
