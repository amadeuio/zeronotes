import { IconButton, Input } from '@/components';
import { selectActions, selectFiltersSearch, useStore } from '@/store';
import { cn } from '@/utils';

interface SearchProps {
  className?: string;
}

const Search = ({ className }: SearchProps) => {
  const search = useStore(selectFiltersSearch);
  const actions = useStore(selectActions);

  return (
    <div className={cn('relative flex w-full max-w-[720px]', className)}>
      <Input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => actions.filters.set({ search: e.target.value })}
      />
      {search !== '' && (
        <IconButton
          onClick={() => actions.filters.set({ search: '' })}
          label="Clear"
          iconName="clear"
          size={22}
          className="absolute top-1/2 right-1 -translate-y-1/2 p-2"
        />
      )}
    </div>
  );
};

export default Search;
