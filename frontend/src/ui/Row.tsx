interface RowProps {
  children: React.ReactNode;
  className?: string;
}

const Row = ({ children, className = "" }: RowProps) => {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {children}
    </div>
  );
};

export default Row;
