import { cn } from '@/utils';
import { useLayoutEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  isTitle?: boolean;
}

const TextEdit = ({
  value,
  onChange,
  placeholder,
  className,
  onFocus,
  isTitle = false,
}: EditableTextProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resizeObserver = new ResizeObserver(() => {
      adjustTextareaHeight();
    });

    resizeObserver.observe(textarea);

    return () => resizeObserver.disconnect();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      rows={1}
      className={cn(
        'max-h-[750px] resize-none overflow-y-auto text-[14.3px] leading-relaxed tracking-[-0.2px] outline-none placeholder:font-medium placeholder:text-neutral-400',
        isTitle && 'text-xl leading-tight placeholder:text-xl',
        className,
      )}
      placeholder={placeholder}
      onFocus={onFocus}
    />
  );
};

export default TextEdit;
