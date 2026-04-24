import { Icon } from '@/components/common';
import { selectAuth, useStore } from '@/store';
import { useNavigate } from '@tanstack/react-router';

const DemoBanner = () => {
  const { isDemoMode } = useStore(selectAuth);
  const navigate = useNavigate();

  if (!isDemoMode) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-x-2 bg-amber-500/20 px-4 py-2 text-sm text-amber-200">
      <Icon name="info" size={16} className="text-amber-300" />
      <span>
        You're in demo mode.{' '}
        <button
          onClick={() => {
            console.log('clicked');
            navigate({ to: '/signup' });
          }}
          className="font-medium text-amber-100 underline hover:text-white"
        >
          Sign up
        </button>{' '}
        to save your notes.
      </span>
    </div>
  );
};

export default DemoBanner;
