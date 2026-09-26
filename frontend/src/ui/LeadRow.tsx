import type { Lead } from "../types/lead";
import LeadActions from "./LeadActions";
import StatusBadge from "./StatusBadge";
import { SpinnerInline } from "./Spinner";
import Table from "./Table";

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  isDeleting?: boolean;
}

const LeadRow = ({ lead, onEdit, onDelete, isDeleting = false }: LeadRowProps) => {
  return (
    <Table.Row>
      <div className="min-w-0">
        <p className="table-text truncate font-medium">{lead.name}</p>
      </div>

      <div className="min-w-0">
        <p className="table-text truncate text-text-secondary">{lead.email}</p>
      </div>

      <div>
        <p className="table-text text-text-secondary">{lead.phone}</p>
      </div>

      <div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="flex items-center justify-end">
        {isDeleting ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background">
            <SpinnerInline />
          </span>
        ) : (
          <LeadActions
            onEdit={() => onEdit(lead)}
            onDelete={() => onDelete(lead)}
          />
        )}
      </div>
    </Table.Row>
  );
};

export default LeadRow;
