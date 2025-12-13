import type { SelectProps as AntSelectProps } from "antd";

interface FilterProps {
	onClick?: () => void;
	filters?: FilterTypes[];
	className?: string;
	showAddBtn?: boolean;
	handleAddBtnClick?: () => void;
	addBtnText?: string;
}

interface FilterTypes {
	title: string;
	onClick?: () => void;
	onChange?: (
		e: React.ChangeEvent<HTMLInputElement> | AntSelectProps["onChange"] | string | any
	) => void;
	onSelect?: (value: string, label?: any) => void;
	onSearch?: (value: string, label?: any) => void;
	options?: AntSelectProps["options"];
	type: "select" | "autocomplete" | "input" | "date";
	className?: string;
	placeholder?: string;
	value?: string | number | any;
	loading?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	size?: "large" | "middle" | "small";
	selectType?: "default" | "multiple" | "tags";
	minDate?: any;
	maxDate?: any;
}

export type { FilterProps, FilterTypes };
