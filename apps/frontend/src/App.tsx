import {
  DemoBanner,
  EditLabelsModal,
  Main,
  Navbar,
  NoteActive,
  Sidebar,
  Spinner,
} from '@/components';
import { useBootstrap, useMobile } from '@/hooks';
import { selectActions, selectActiveNoteId, selectIsDemo, selectUi, useStore } from '@/store';
import { cn } from '@/utils';

const App = () => {
  const isLoading = useBootstrap();
  const isMobile = useMobile();
  const { isEditLabelsMenuOpen, isSidebarCollapsed } = useStore(selectUi);
  const activeNoteId = useStore(selectActiveNoteId);
  const isDemo = useStore(selectIsDemo);
  const actions = useStore(selectActions);

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      {isLoading ? (
        <Spinner className="mx-auto my-auto" size={40} />
      ) : (
        <div
          className={cn(
            'flex flex-1 overflow-y-auto',
            isSidebarCollapsed || isMobile ? 'pl-18' : 'pl-70',
            isDemo && 'pb-16',
          )}
        >
          <Sidebar isMobile={isMobile} />
          <Main />
        </div>
      )}
      {isEditLabelsMenuOpen && (
        <EditLabelsModal onClose={() => actions.ui.setEditLabelsMenuOpen(false)} />
      )}
      {activeNoteId && <NoteActive />}
      {isDemo && <DemoBanner />}
    </div>
  );
};

export default App;
