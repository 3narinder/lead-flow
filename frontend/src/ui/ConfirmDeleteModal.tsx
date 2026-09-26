import Modal from "./Modal";
import { SpinnerInline } from "./Spinner";

interface ConfirmDeleteModalProps {
  open: boolean;
  leadName?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal = ({
  open,
  leadName,
  isDeleting = false,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Delete lead">
      <div className="space-y-5">
        <p className="body-text text-text-secondary">
          Are you sure you want to delete{" "}
          <span className="font-medium text-text-primary">
            {leadName ?? "this lead"}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-primary transition hover:bg-background disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-error px-4 text-sm font-medium text-white transition hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting && <SpinnerInline className="border-white/30 border-t-white" />}
            {isDeleting ? "Deleting..." : "Delete lead"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
