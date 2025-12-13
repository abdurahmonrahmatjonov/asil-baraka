import { Input as AntInput, ConfigProvider } from "antd";
import { useState } from "react";
import { darkTheme, lightTheme } from "./theme";
import { Search } from "lucide-react";

// Define proper types for props
interface InputProps {
	value?: string | number;
	placeholder?: string;
	className?: string;
	loading?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	type?: string;
	size?: "large" | "middle" | "small";
	defaultValue?: string | number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	prefix?: React.ReactNode | React.ReactElement;
	suffix?: React.ReactNode | React.ReactElement;
}

export default function Input({
	value,
	placeholder = "",
	className = "",
	loading = false,
	disabled = false,
	allowClear = false,
	type = "text",
	size = "middle",
	onChange,
	onPressEnter,
	suffix,
}: InputProps) {
	const [darkMode] = useState(false);

	return (
		<ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
			<AntInput
				className={`min-w-40 ${className}`}
				value={value}
				placeholder={placeholder}
				disabled={disabled || loading}
				allowClear={allowClear}
				type={type}
				size={size}
				suffix={suffix}
				onChange={onChange}
				onPressEnter={onPressEnter}
				onWheel={(e) => {
					e.currentTarget.blur();
				}}
				style={{ color: disabled ? "black" : undefined }}
			/>
		</ConfigProvider>
	);
}

export function InputSearch({
	value,
	placeholder = "Enter text...",
	className = "",
	loading = false,
	disabled = false,
	allowClear = false,
	type = "text",
	size = "middle",
	onChange,
	onPressEnter,
	defaultValue,
	prefix,
	suffix = <Search className="text-gray-500" size={20} />,
}: InputProps) {
	const [darkMode] = useState(false);

	return (
		<ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
			<AntInput
				className={`w-full ${className}`}
				value={value}
				placeholder={placeholder}
				disabled={disabled || loading}
				allowClear={allowClear}
				type={type}
				size={size}
				onChange={onChange}
				onPressEnter={onPressEnter}
				prefix={prefix}
				suffix={suffix}
				defaultValue={defaultValue}
				style={{ color: disabled ? "black" : undefined }}
			/>
		</ConfigProvider>
	);
}
