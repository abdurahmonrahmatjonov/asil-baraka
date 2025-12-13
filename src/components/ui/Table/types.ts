interface ColumnsTypes {
	title: string;
	dataIndex: string;
	key: string;
	width?: number | string;
	render?: (text: any, record: any, index: number) => React.ReactNode;
	sorter?: boolean;
	sortDirections?: ("ascend" | "descend" | "ascend" | "descend")[];
	type?: "number" | "string" | "date";
	align?: "left" | "center" | "right";
	fixed?: boolean | "left" | "right";
	childer?: any[];
}

export type { ColumnsTypes };
