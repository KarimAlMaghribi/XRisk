interface LandingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  hideTextOnMobile?: boolean;
}

export function LandingButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
  icon,
  iconPosition = "right",
  hideTextOnMobile = false,
}: LandingButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-[100px] cursor-pointer border-none whitespace-nowrap flex items-center justify-center gap-2";
  const transitionStyles = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  const variantStyles = {
    primary:
      "bg-brand text-white shadow-brand-sm hover:bg-brand-hover hover:shadow-brand-md hover:scale-105 active:scale-[0.98]",
    secondary:
      "bg-surface-frost backdrop-blur-lg text-primary shadow-sm hover:bg-surface-frost-hover hover:shadow-md",
    outline:
      "bg-surface-frost/50 backdrop-blur-lg text-primary border border-primary shadow-sm hover:bg-surface-frost hover:shadow-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`button-text ${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ transition: transitionStyles }}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && iconPosition === "left" && icon}
      {hideTextOnMobile ? (
        <>
          <span className="md:inline hidden">{children}</span>
          {icon && iconPosition === "right" && <span className="md:hidden">{icon}</span>}
        </>
      ) : (
        children
      )}
      {icon && iconPosition === "right" && !hideTextOnMobile && icon}
    </button>
  );
}