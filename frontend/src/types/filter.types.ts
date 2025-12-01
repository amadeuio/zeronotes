import type { Label } from './label.types';

export type View =
  | { type: 'notes' }
  | { type: 'label'; id: Label['id'] }
  | { type: 'archive' }
  | { type: 'trash' };

export interface Filters {
  search: string;
  view: View;
}
