import { NoteCreate, NoteView } from '@/components';
import { useSetGridColumns } from '@/hooks';
import {
  selectHasPinnedNotes,
  selectHasUnpinnedNotes,
  selectNotesDisplay,
  selectPinnedHeight,
  selectTotalHeight,
  selectTotalWidth,
  useStore,
} from '@/store';
import EmptyState from './EmptyState';
import SectionTitle from './SectionTitle';

const Main = () => {
  const notes = useStore(selectNotesDisplay);
  const hasPinnedNotes = useStore(selectHasPinnedNotes);
  const hasUnpinnedNotes = useStore(selectHasUnpinnedNotes);
  const pinnedHeight = useStore(selectPinnedHeight);
  const totalWidth = useStore(selectTotalWidth);
  const totalHeight = useStore(selectTotalHeight);
  const gridRef = useSetGridColumns();

  return (
    <main className="flex min-h-fit min-w-0 flex-1 flex-col items-center gap-12 p-4 md:gap-20 md:px-2 md:py-12">
      <NoteCreate />
      {notes.length === 0 ? (
        <EmptyState />
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
