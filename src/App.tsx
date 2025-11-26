import { EditLabelsModal, Icon, Main, Navbar, NoteActive, Sidebar } from '@/components';
import { useBootstrap, useMobile } from '@/hooks';
import { selectActions, selectActiveNoteId, selectUi, useStore } from '@/store';
import { cn } from '@/utils';

const App = () => {
  const isLoading = useBootstrap();
  const isMobile = useMobile();
  const { isEditLabelsMenuOpen, isSidebarCollapsed } = useStore(selectUi);
  const activeNoteId = useStore(selectActiveNoteId);
  const { ui } = useStore(selectActions);

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      {isLoading ? (
        <Icon
          name="progress_activity"
          className="mx-auto my-auto animate-spin text-neutral-400"
          size={38}
        />
      ) : (
        <div
          className={cn(
            'flex flex-1 overflow-y-auto',
            isSidebarCollapsed || isMobile ? 'pl-18' : 'pl-70',
          )}
        >
          <Sidebar isMobile={isMobile} />
          <Main />
        </div>
      )}
      {isEditLabelsMenuOpen && <EditLabelsModal onClose={() => ui.setEditLabelsMenuOpen(false)} />}
      {activeNoteId && <NoteActive />}
    </div>
  );
};

export default App;
