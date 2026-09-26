import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const newParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }

    newParams.set("page", "1");

    setSearchParams(newParams);
  };

  return (
    <div className="relative w-full sm:w-72">
      <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />

      <input
        type="search"
        value={search}
        onChange={handleChange}
        placeholder="Search leads..."
        aria-label="Search leads"
        className="input-control h-10 pl-10"
      />
    </div>
  );
};

export default Search;
