import { Select as AntSelect, ConfigProvider } from "antd";
import { useMemo, useState } from "react";
import { darkTheme, lightTheme } from "./theme";
import type { SelectProps as AntSelectProps } from "antd";
import clsx from "clsx";

// Define props for the Select component
interface SelectProps extends AntSelectProps {
	className?: string;
	loading?: boolean;
	options?: AntSelectProps["options"];
}

export default function Select({
	className = "",
	loading = false,
	options = [],
	...props
}: SelectProps) {
	const [darkMode] = useState(false);
	const memoizedOptions = useMemo(() => options, [options]);

	return (
		<ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
			<AntSelect
				className={clsx("min-w-32 ", className)}
				loading={loading}
				allowClear
				showSearch
				filterOption={(input, option) =>
					String(option?.label)?.toLowerCase().includes(input.toLowerCase())
				}
				options={memoizedOptions}
				{...props}
			/>
		</ConfigProvider>
	);
}
