interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type" | "placeholder"
  > {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  rounded: "lg" | "xl" | "2xl" | "full";
}

export default function SimpleInput({
  value,
  onValueChange,
  placeholder = "",
  type = "text",
  icon = null,
  onIconClick,
  rounded = "xl",
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className={`w-full h-12 px-4 pr-12 bg-white border-2 border-gray-200 rounded-${rounded} outline-none focus:border-gray-300 transition-colors duration-200 ${
          icon ? "pr-16" : ""
        }`}
        {...props}
      />
      {icon && (
        <button
          type="button"
          onClick={onIconClick}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          disabled={!onIconClick}
        >
          {icon}
        </button>
      )}
    </div>
  );
}
