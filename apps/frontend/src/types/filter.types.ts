import type { Label } from '@zeronotes/shared';

export type View =
  | { type: 'notes' }
  | { type: 'label'; id: Label['id'] }
  | { type: 'archive' }
  | { type: 'trash' };

export interface Filters {
  search: string;
  view: View;
}
