import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-360 items-center justify-between px-6 sm:px-8 lg:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary">
            L
          </span>
          <span className="text-xl font-semibold tracking-tight text-text-primary">
            Lead<span className="text-primary">Flow</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <UserAvatar />

          <div className="hidden h-6 w-px bg-border sm:block" />

          <HeaderMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
