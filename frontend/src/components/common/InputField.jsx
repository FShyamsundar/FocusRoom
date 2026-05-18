const InputField = ({ label, className = "", ...props }) => (
  <label className={`flex flex-col gap-2 ${className}`}>
    <span className="text-sm font-medium text-ink">{label}</span>
    <input
      className="rounded-2xl border border-line bg-plate px-4 py-3 text-ink outline-none transition placeholder:text-muted focus:border-accent focus:bg-white"
      {...props}
    />
  </label>
);

export default InputField;
