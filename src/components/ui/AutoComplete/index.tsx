import { AutoComplete as AntAutoComplete, ConfigProvider } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useState, useMemo } from "react";
import { darkTheme, lightTheme } from "./theme";
import { Search } from "lucide-react";

interface AutoCompleteProps {
	options?: DefaultOptionType[];
	value?: string;
	placeholder?: string;
	className?: string;
	loading?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	onChange?: (value: string) => void;
	onSelect?: (value: string, option: DefaultOptionType) => void;
	onSearch?: (value: string) => void; // ✅ FIXED: Removed 'option'
	filterOption?: boolean | ((input: string, option?: DefaultOptionType) => boolean);
	suffix?: React.ReactNode | React.ReactElement;
	prefix?: React.ReactNode | React.ReactElement;
	size?: "large" | "middle" | "small";
	props?: any; // For any additional props
}

const defaultFilterOption = (input: string, option?: DefaultOptionType) => {
	return (
		option?.label?.toString().toLowerCase().includes(input.toLowerCase()) ||
		option?.value?.toString().toLowerCase().includes(input.toLowerCase()) ||
		false
	);
};

export default function AutoComplete({
	options = [],
	value,
	placeholder = "Search...",
	className = "",
	disabled = false,
	allowClear = true,
	onChange,
	onSelect,
	onSearch,
	filterOption = defaultFilterOption,
	suffix = <Search className="text-gray-500" size={20} />,
	prefix = <Search className="text-gray-500" size={20} />,
	size = "middle",
	...props
}: AutoCompleteProps) {
	const [darkMode] = useState(false);

	const memoizedOptions = useMemo(() => options, [options]);

	return (
		<ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
			<AntAutoComplete
				className={`min-w-40 ${className}`}
				options={memoizedOptions}
				value={value}
				placeholder={placeholder}
				prefix={prefix}
				disabled={disabled}
				allowClear={allowClear}
				onChange={onChange}
				onSelect={onSelect}
				onSearch={onSearch}
				size={size}
				filterOption={filterOption}
				showSearch
				{...props}
			/>
		</ConfigProvider>
	);
}
