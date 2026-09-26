import { HiOutlineUsers } from "react-icons/hi2";

interface EmptyProps {
  resourceName?: string;
  onAction?: () => void;
}

const Empty = ({ resourceName = "leads", onAction }: EmptyProps) => {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <HiOutlineUsers className="h-6 w-6 text-primary" />
      </div>

      <h3 className="section-title">No {resourceName} found</h3>

      <p className="secondary-text mt-2 max-w-sm">
        There are no {resourceName} to display right now. Try changing your
        search or filters.
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            mt-5
            inline-flex
            h-9
            items-center
            rounded-lg
            bg-primary
            px-4
            text-sm
            font-medium
            text-white
            transition-colors
            hover:bg-primary/90
            focus:outline-none
            focus:ring-2
            focus:ring-primary/20
          "
        >
          Add lead
        </button>
      )}
    </div>
  );
};

export default Empty;
