import Pagination from "../../ui/Pagination";
import Table from "../../ui/Table";
import LeadRow from "../../ui/LeadRow";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import type { Lead } from "../../types/lead";

interface LeadTableProps {
  leads: Lead[];
  totalCount: number;
  pageSize?: number;
  currentPage?: number;
  isLoading?: boolean;
  isDeletingId?: string | null;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAddLead: () => void;
}

const LeadTable = ({
  leads,
  totalCount,
  pageSize = 10,
  currentPage,
  isLoading = false,
  isDeletingId = null,
  onEdit,
  onDelete,
  onAddLead,
}: LeadTableProps) => {
  if (isLoading) {
    return <Spinner />;
  }

  if (!totalCount) {
    return <Empty resourceName="leads" onAction={onAddLead} />;
  }

  return (
    <Table columns="1.4fr 2fr 1.4fr 1fr 3.2rem">
      <Table.Header>
        <div className="table-header">Name</div>
        <div className="table-header">Email</div>
        <div className="table-header">Phone</div>
        <div className="table-header">Status</div>
        <div />
      </Table.Header>

      <Table.Body
        data={leads}
        render={(lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeletingId === lead.id}
          />
        )}
      />

      <Table.Footer>
        <Pagination
          count={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
        />
      </Table.Footer>
    </Table>
  );
};

export default LeadTable;
