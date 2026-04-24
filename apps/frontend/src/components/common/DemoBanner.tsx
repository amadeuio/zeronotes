import { selectActions, selectIsDemo, useStore } from '@/store';
import { useNavigate } from '@tanstack/react-router';

const DemoBanner = () => {
  const isDemo = useStore(selectIsDemo);
  const actions = useStore(selectActions);
  const navigate = useNavigate();

  if (!isDemo) return null;

  return (
    <div className="flex items-center justify-between border-b border-amber-500/20 bg-amber-500/8 px-4 py-2">
      <p className="text-xs text-amber-300/80">
        Demo mode &mdash; notes are stored in memory and will be lost on refresh
      </p>
      <button
        type="button"
        onClick={() => {
          actions.auth.clear();
          navigate({ to: '/signup' });
        }}
        className="ml-4 shrink-0 cursor-pointer rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 transition-colors duration-150 hover:bg-amber-500/20"
      >
        Create free account →
      </button>
    </div>
  );
};

export default DemoBanner;
