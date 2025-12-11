import type { View } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getEmptyStateConfig = (view: View): { icon: string; message: string } | null => {
  switch (view.type) {
    case 'notes':
      return {
        icon: 'lightbulb',
        message: 'Notes you add appear here',
      };
    case 'archive':
      return {
        icon: 'archive',
        message: 'Your archived notes appear here',
      };
    case 'trash':
      return {
        icon: 'delete',
        message: 'No notes in Trash',
      };
    case 'label':
      return {
        icon: 'label',
        message: 'No notes with this label yet',
      };
    default:
      return null;
  }
};
