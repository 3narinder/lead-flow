import Filter from "../../ui/Filter";
import Search from "../../ui/Search";
import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";

const LeadsTableOperations = () => {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-4 shadow-card backdrop-blur-sm">
      <TableOperations className="w-full lg:w-auto">
        <Search />

        <Filter
          filterField="status"
          options={[
            { value: "all", label: "All statuses" },
            { value: "new", label: "New" },
            { value: "contacted", label: "Contacted" },
            { value: "qualified", label: "Qualified" },
            { value: "converted", label: "Converted" },
            { value: "lost", label: "Lost" },
          ]}
        />

        <SortBy
          options={[
            { value: "createdAt-desc", label: "Newest first" },
            { value: "createdAt-asc", label: "Oldest first" },
            { value: "name-asc", label: "Name A–Z" },
            { value: "name-desc", label: "Name Z–A" },
          ]}
        />
      </TableOperations>
    </div>
  );
};

export default LeadsTableOperations;
