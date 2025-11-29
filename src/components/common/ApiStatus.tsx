import { Icon, Spinner } from '@/components';
import { selectApiStatus, useStore } from '@/store';

const ApiStatus = () => {
  const { loading, error } = useStore(selectApiStatus);

  return loading ? (
    <Spinner className="p-3" />
  ) : error ? (
    <Icon name="error" className="p-3 text-neutral-400" size={24} />
  ) : (
    <Icon name="cloud_done" className="p-3 text-neutral-400" size={24} />
  );
};

export default ApiStatus;
