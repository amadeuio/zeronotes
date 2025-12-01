interface SectionTitleProps {
  label: string;
  verticalOffset?: number;
}

const SectionTitle = ({ label, verticalOffset }: SectionTitleProps) => (
  <div
    className="absolute -top-6 left-4 text-[11px] font-medium text-neutral-400"
    style={verticalOffset ? { transform: `translateY(${verticalOffset}px)` } : undefined}
  >
    {label}
  </div>
);

export default SectionTitle;
