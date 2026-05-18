const variantStyles = {
  primary: "border-[#c7d6f5] bg-accentSoft text-ink",
  secondary: "border-[#d6cdbc] bg-plateBlue text-ink",
  ghost: "border-[#ddd3c2] bg-plate text-muted",
  danger: "border-[#ddc0c0] bg-roseSoft text-ink",
};

const pressedStyles = {
  primary:
    "bg-[#d4e3ff] shadow-[inset_4px_4px_10px_rgba(174,190,214,0.55),inset_-4px_-4px_10px_rgba(255,255,255,0.92)]",
  secondary:
    "bg-[#dbe7f5] shadow-[inset_4px_4px_10px_rgba(174,190,214,0.45),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]",
  ghost:
    "bg-[#f7f0e3] text-ink shadow-[inset_4px_4px_10px_rgba(201,190,171,0.35),inset_-4px_-4px_10px_rgba(255,255,255,0.95)]",
  danger:
    "bg-[#efd1d1] shadow-[inset_4px_4px_10px_rgba(208,173,173,0.45),inset_-4px_-4px_10px_rgba(255,255,255,0.85)]",
};

const Button = ({
  type = "button",
  children,
  className = "",
  variant = "primary",
  disabled = false,
  pressed = false,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-150 ${
      pressed
        ? pressedStyles[variant]
        : `shadow-[6px_6px_14px_rgba(196,185,166,0.42),-6px_-6px_14px_rgba(255,255,255,0.95)] hover:translate-y-[1px] hover:shadow-[3px_3px_10px_rgba(196,185,166,0.38),-3px_-3px_10px_rgba(255,255,255,0.92)] active:translate-y-[2px] active:shadow-[inset_4px_4px_10px_rgba(196,185,166,0.42),inset_-4px_-4px_10px_rgba(255,255,255,0.92)]`
    } disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
    {...props}
  >
  {children}
  </button>
);

export default Button;
