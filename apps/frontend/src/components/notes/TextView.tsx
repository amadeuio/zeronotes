import { cn } from '@/utils';

interface HighlightedTextProps {
  value: string;
  searchTerm?: string;
}

const HighlightedText = ({ value, searchTerm }: HighlightedTextProps) => {
  const parts = value.split(new RegExp(`(${searchTerm})`, 'gi'));

  return parts.map((part, i) =>
    searchTerm && part.toLowerCase() === searchTerm.toLowerCase() ? (
      <mark key={i} className="rounded-sm bg-yellow-200">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
};

interface ViewOnlyTextProps {
  value: string;
  searchTerm?: string;
  className?: string;
  isTitle?: boolean;
}

const TextView = ({ value, searchTerm, className, isTitle = false }: ViewOnlyTextProps) => (
  <div
    className={cn(
      'line-clamp-12 resize-none pr-6 text-[14.3px] leading-relaxed tracking-[-0.2px] whitespace-pre-wrap outline-none placeholder:font-medium placeholder:text-neutral-400',
      isTitle && 'text-xl leading-tight placeholder:text-xl',
      className,
    )}
  >
    {searchTerm && searchTerm.trim() ? (
      <HighlightedText value={value} searchTerm={searchTerm} />
    ) : (
      <>{value}</>
    )}
  </div>
);

export default TextView;
