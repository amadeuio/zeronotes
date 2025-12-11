import { Icon, NoteCreate, NoteView } from '@/components';
import { useSetGridColumns } from '@/hooks';
import {
  selectFiltersView,
  selectHasPinnedNotes,
  selectHasUnpinnedNotes,
  selectNotesDisplay,
  selectPinnedHeight,
  selectTotalHeight,
  selectTotalWidth,
  useStore,
} from '@/store';
import type { View } from '@/types';

interface SectionTitleProps {
  label: string;
  verticalOffset?: number;
}

const SectionTitle = ({ label, verticalOffset }: SectionTitleProps) => (
  <div
    className="absolute -top-6 left-4 text-[11px] font-medium text-neutral-400"
    style={verticalOffset ? { transform: `translateY(${verticalOffset}px)` } : undefined}
  >
    {label}
  </div>
);

interface EmptyStateProps {
  view: View;
}

const EmptyState = ({ view }: EmptyStateProps) => {
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

const Main = () => {
  const notes = useStore(selectNotesDisplay);
  const hasPinnedNotes = useStore(selectHasPinnedNotes);
  const hasUnpinnedNotes = useStore(selectHasUnpinnedNotes);
  const pinnedHeight = useStore(selectPinnedHeight);
  const totalWidth = useStore(selectTotalWidth);
  const totalHeight = useStore(selectTotalHeight);
  const view = useStore(selectFiltersView);
  const gridRef = useSetGridColumns();

  return (
    <main className="flex min-h-fit min-w-0 flex-1 flex-col items-center gap-12 p-4 md:gap-20 md:px-2 md:py-12">
      <NoteCreate />
      {notes.length === 0 ? (
        <EmptyState view={view} />
      ) : (
        <div ref={gridRef} className="w-full">
          <div className="relative mx-auto" style={{ width: totalWidth, height: totalHeight }}>
            {hasPinnedNotes && (
              <>
                <SectionTitle label="PINNED" />
                {hasUnpinnedNotes && <SectionTitle label="OTHERS" verticalOffset={pinnedHeight} />}
              </>
            )}
            {notes.map((note) => (
              <NoteView key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Main;
