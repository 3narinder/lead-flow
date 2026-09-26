import { useSearchParams } from "react-router-dom";

interface SortOption {
  value: string;
  label: string;
}

interface SortByProps {
  options: SortOption[];
}

const SortBy = ({ options }: SortByProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSort = searchParams.get("sortBy") || options[0]?.value || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", e.target.value);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={handleChange}
        aria-label="Sort leads"
        className="input-control h-10 min-w-36 appearance-none pr-9 font-medium"
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

export default SortBy;
