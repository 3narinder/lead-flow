import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const ButtonIcon = ({
  children,
  className = "",
  ...props
}: ButtonIconProps) => {
  return (
    <button
      type="button"
      {...props}
      className={`
        flex h-10 w-10 items-center justify-center
        rounded-lg
        text-text-secondary
        transition-all
        duration-200
        hover:bg-background
        hover:text-primary
        focus:outline-none
        focus:ring-2
        focus:ring-primary/20
        disabled:cursor-not-allowed
        disabled:opacity-50
        [&_svg]:h-5
        [&_svg]:w-5
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ButtonIcon;
