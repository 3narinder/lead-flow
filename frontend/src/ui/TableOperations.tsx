interface TableOperationsProps {
  children: React.ReactNode;
  className?: string;
}

const TableOperations = ({
  children,
  className = "",
}: TableOperationsProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {children}
    </div>
  );
};

export default TableOperations;
