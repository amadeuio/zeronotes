import { Icon } from '@/components';
import { useState } from 'react';

const DemoBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-lg items-center gap-2 rounded-full border border-white/10 bg-neutral-900/95 px-4 py-2.5 pr-3 text-sm text-white/90 shadow-lg backdrop-blur-sm">
        <span className="text-white/70">
          Demo Mode — changes stay on this device and are not synced.
        </span>
        <Icon
          name="close"
          size={18}
          onClick={() => setIsDismissed(true)}
          className="shrink-0 translate-y-px cursor-pointer rounded-full p-0.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        />
      </div>
    </div>
  );
};

export default DemoBanner;
