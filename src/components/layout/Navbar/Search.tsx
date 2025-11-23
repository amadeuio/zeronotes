import { Icon } from '@/components';
import { selectActions, selectFiltersSearch, useStore } from '@/store';
import { cn } from '@/utils';
import { useState } from 'react';

interface SearchIconButtonProps {
  iconName: string;
  label: string;
  size?: number;
  dark?: boolean;
  className?: string;
  onClick?: () => void;
}

const SearchIconButton = ({
  iconName,
  label,
  size = 24,
  dark = false,
  className,
  onClick,
}: SearchIconButtonProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <button
      className={cn(
        'relative flex cursor-pointer items-center justify-center rounded-full p-2 transition-colors duration-150 ease-in-out hover:bg-neutral-500',
        dark && 'hover:bg-neutral-300',
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <Icon
        size={size}
        name={iconName}
        className={cn(
          'text-neutral-100 transition-colors duration-150 ease-in-out',
          dark && 'text-neutral-500',
        )}
      />
      {isTooltipVisible && (
        <div className="absolute top-full left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded bg-neutral-700 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg">
          {label}
        </div>
      )}
    </button>
  );
};

interface SearchProps {
  className?: string;
}

const Search = ({ className }: SearchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const search = useStore(selectFiltersSearch);
  const { filters } = useStore(selectActions);

  return (
    <form
      method="get"
      role="search"
      className={cn(
        'input group flex h-full w-full max-w-[720px] items-center gap-x-2 rounded-lg bg-[#f1f3f43d] px-2',
        isFocused && 'bg-neutral-100',
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <SearchIconButton iconName="search" label="Search" dark={isFocused} />
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent outline-none placeholder:text-neutral-200 focus:text-base focus:placeholder:text-neutral-500"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={search}
        onChange={(e) => filters.set({ search: e.target.value })}
      />
      <SearchIconButton
        iconName="close"
        label="Clear search"
        dark={isFocused}
        onClick={() => filters.set({ search: '' })}
        className={cn(isFocused ? 'opacity-100' : 'cursor-default opacity-0')}
      />
    </form>
  );
};

export default Search;
