import { useEffect, useRef, useState } from "react";
import { HiEllipsisVertical, HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";

interface LeadActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const LeadActions = ({ onEdit, onDelete }: LeadActionsProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Lead actions"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-soft hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      >
        <HiEllipsisVertical className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-modal">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-text-primary transition hover:bg-background"
          >
            <HiOutlinePencilSquare className="h-4 w-4 text-primary" />
            Edit lead
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-error transition hover:bg-error/5"
          >
            <HiOutlineTrash className="h-4 w-4" />
            Delete lead
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadActions;
