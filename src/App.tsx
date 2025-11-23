import { EditLabelsModal, Main, Navbar, NoteActive, Sidebar } from '@/components';
import { useMobile } from '@/hooks';
import { selectActions, selectActiveNoteId, selectUi, useStore } from '@/store';
import { cn } from '@/utils';

const App = () => {
  const isMobile = useMobile();
  const { isEditLabelsMenuOpen, isSidebarCollapsed } = useStore(selectUi);
  const activeNoteId = useStore(selectActiveNoteId);
  const { ui } = useStore(selectActions);

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div
        className={cn(
          'flex flex-1 overflow-y-auto',
          isSidebarCollapsed || isMobile ? 'pl-18' : 'pl-70',
        )}
      >
        <Sidebar isMobile={isMobile} />
        <Main />
      </div>
      {isEditLabelsMenuOpen && <EditLabelsModal onClose={() => ui.setEditLabelsMenuOpen(false)} />}
      {activeNoteId && <NoteActive />}
    </div>
  );
};

export default App;
