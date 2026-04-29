import { selectActions, useStore } from '@/store';
import { useNavigate } from '@tanstack/react-router';

const DemoBanner = () => {
  const actions = useStore(selectActions);
  const navigate = useNavigate();

  const exitDemo = () => {
    actions.ui.exitDemo();
    navigate({ to: '/login' });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-lg items-center gap-3 rounded-full border border-white/10 bg-neutral-900/95 px-4 py-2.5 text-sm text-white/90 shadow-lg backdrop-blur-sm">
        <span className="text-white/70">
          Demo Mode — changes stay on this device and are not synced.
        </span>
        <button
          type="button"
          onClick={exitDemo}
          className="shrink-0 cursor-pointer rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/20"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
