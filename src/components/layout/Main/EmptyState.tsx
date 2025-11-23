import { Icon } from '@/components';
import { selectFiltersView, useStore } from '@/store';

const EmptyState = () => {
  const view = useStore(selectFiltersView);

  const getConfig = () => {
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

  const config = getConfig();

  if (!config) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Icon name={config.icon} size={120} />
      <p className="text-xl text-neutral-400">{config.message}</p>
    </div>
  );
};

export default EmptyState;
