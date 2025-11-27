interface LandingInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

export function LandingInput({
  value,
  onChange,
  placeholder = "",
  className = "",
  "aria-label": ariaLabel,
}: LandingInputProps) {
  return (
    <div className={`backdrop-blur-xl bg-surface-input border border-input flex-1 rounded-[100px] shadow-lg ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="body-base text-primary placeholder:text-primary bg-transparent w-full px-6 py-3 outline-none rounded-[100px]"
        aria-label={ariaLabel}
      />
    </div>
  );
}
