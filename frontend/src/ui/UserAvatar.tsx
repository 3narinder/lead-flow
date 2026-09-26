import { FaUser } from "react-icons/fa6";

const UserAvatar = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <FaUser className="h-4 w-4 text-primary" />
      </div>

      <div className="hidden sm:block">
        <p className="text-sm font-medium leading-5 text-text-primary">
          John Doe
        </p>

        <p className="text-xs leading-4 text-text-secondary">Administrator</p>
      </div>
    </div>
  );
};

export default UserAvatar;
