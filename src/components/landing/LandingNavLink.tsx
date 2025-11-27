import React from "react";

interface LandingNavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
}

export function LandingNavLink({
  children,
  onClick,
  isActive = false,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: LandingNavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`button-text relative px-4 py-3 rounded-[100px] cursor-pointer ${
        isActive
          ? "text-brand bg-brand-alpha-12 backdrop-blur-md border border-brand-alpha-20 shadow-brand-active"
          : "text-secondary hover:text-brand hover:bg-brand-alpha-6 hover:backdrop-blur-sm"
      }`}
      style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
