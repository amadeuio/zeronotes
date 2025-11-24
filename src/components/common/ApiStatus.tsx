import { Icon } from '@/components';
import { selectApiStatus, useStore } from '@/store';

const ApiStatus = () => {
  const { loading, error, success } = useStore(selectApiStatus);

  return loading ? (
    <Icon name="progress_activity" className="animate-spin p-3 text-neutral-400" size={24} />
  ) : error ? (
    <Icon name="error" className="p-3 text-neutral-400" size={24} />
  ) : success ? (
    <Icon name="cloud_done" className="p-3 text-neutral-400" size={24} />
  ) : null;
};

export default ApiStatus;
