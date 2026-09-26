import { createContext, useContext } from "react";

interface TableContextValue {
  columns: string;
}

const TableContext = createContext<TableContextValue | null>(null);

interface TableProps {
  columns: string;
  children: React.ReactNode;
}

interface TablePartProps {
  children: React.ReactNode;
}

interface TableBodyProps<T> {
  data: T[];
  render: (item: T) => React.ReactNode;
}

interface TableRowProps {
  children: React.ReactNode;
}

const Table = ({ columns, children }: TableProps) => {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        {children}
      </div>
    </TableContext.Provider>
  );
};

const Header = ({ children }: TablePartProps) => {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("Table.Header must be used inside Table");
  }

  return (
    <div
      role="row"
      className="hidden items-center border-b border-border bg-primary-soft/60 px-5 py-3.5 lg:grid"
      style={{ gridTemplateColumns: context.columns }}
    >
      {children}
    </div>
  );
};

const Row = ({ children }: TableRowProps) => {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("Table.Row must be used inside Table");
  }

  return (
    <div
      role="row"
      className="grid items-center border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-background/70"
      style={{ gridTemplateColumns: context.columns }}
    >
      {children}
    </div>
  );
};

const Body = <T,>({ data, render }: TableBodyProps<T>) => {
  if (!data.length) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="body-text font-medium">No data to show.</p>
      </div>
    );
  }

  return <div className="max-h-125 overflow-y-auto">{data.map(render)}</div>;
};

const Footer = ({ children }: TablePartProps) => {
  return (
    <footer className="border-t border-border bg-background/50 px-5 py-4">
      {children}
    </footer>
  );
};

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
