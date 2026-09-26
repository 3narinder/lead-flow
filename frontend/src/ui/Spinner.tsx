const sizeClasses = {
  sm: "h-3.5 w-3.5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-10 w-10 border-[3px]",
} as const;

interface SpinnerProps {
  size?: keyof typeof sizeClasses;
  className?: string;
  label?: string;
}

export const SpinnerInline = ({
  size = "sm",
  className = "",
}: Omit<SpinnerProps, "label">) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-border border-t-primary ${sizeClasses[size]} ${className}`}
      aria-hidden
    />
  );
};

const Spinner = ({ size = "md", label = "Loading" }: SpinnerProps) => {
  return (
    <div
      className="flex min-h-80 items-center justify-center"
      role="status"
      aria-label={label}
    >
      <SpinnerInline size={size === "sm" ? "md" : size} />
    </div>
  );
};

export default Spinner;
