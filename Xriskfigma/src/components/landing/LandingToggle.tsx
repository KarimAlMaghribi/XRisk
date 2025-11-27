interface LandingToggleProps {
  options: {
    value: string;
    label: string;
  }[];
  selectedValue: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export function LandingToggle({
  options,
  selectedValue,
  onChange,
  ariaLabel,
}: LandingToggleProps) {
  return (
    <div
      className="bg-surface-frost backdrop-blur-lg flex items-center p-1 rounded-[100px] shadow-sm relative"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`button-text-sm px-6 py-3 rounded-[100px] whitespace-nowrap relative z-10 cursor-pointer ${
            selectedValue === option.value
              ? "text-white"
              : "text-secondary hover:text-primary hover:bg-black-alpha-3"
          }`}
          style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
          aria-pressed={selectedValue === option.value}
          aria-label={`Wechseln zu ${option.label}`}
        >
          {option.label}
        </button>
      ))}

      {/* Animated Background Slider */}
      <div
        className="absolute top-1 bottom-1 rounded-[100px] shadow-input bg-brand"
        style={{
          width: `calc(${100 / options.length}% - ${8 / options.length}px)`,
          left: `calc(${(100 / options.length) * options.findIndex((o) => o.value === selectedValue)}% + 4px)`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
