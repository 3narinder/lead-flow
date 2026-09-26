import type { LeadStatus } from "../types/lead";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: "New",
    className: "status-badge status-badge-new",
  },
  contacted: {
    label: "Contacted",
    className: "status-badge status-badge-contacted",
  },
  qualified: {
    label: "Qualified",
    className: "status-badge status-badge-qualified",
  },

  lost: {
    label: "Lost",
    className: "status-badge status-badge-lost",
  },
};

interface StatusBadgeProps {
  status: LeadStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className={config.className}>
      <span className="status-badge-dot" aria-hidden />
      {config.label}
    </span>
  );
};

export default StatusBadge;
