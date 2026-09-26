import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-360 items-center justify-between px-6 sm:px-8 lg:px-10">
        <a href="/" aria-label="LeadFlow home" className="flex items-center">
          <img
            src="/logo.png"
            alt="LeadFlow"
            className="h-10 w-auto object-contain sm:h-11"
          />
        </a>

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
