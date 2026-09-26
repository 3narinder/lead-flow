import { useSearchParams } from "react-router-dom";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  filterField: string;
  options: FilterOption[];
}

const Filter = ({ filterField, options }: FilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilter =
    searchParams.get(filterField) || options[0]?.value || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);

    if (e.target.value === "all") {
      newParams.delete(filterField);
    } else {
      newParams.set(filterField, e.target.value);
    }

    newParams.set("page", "1");

    setSearchParams(newParams);
  };

  return (
    <div className="relative">
      <select
        value={currentFilter}
        onChange={handleChange}
        aria-label="Filter leads by status"
        className="input-control h-10 min-w-32 appearance-none pr-9 font-medium"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
        ▾
      </span>
    </div>
  );
};

export default Filter;
