import { Table as AntTable, ConfigProvider } from "antd";
import { darkTheme, lightTheme } from "./theme";
import "./styles.css";
import type { ColumnsTypes } from "./types";
import { useInfiniteScroll } from "@/hooks/useInfinityScroll";
import formatNumber from "@/helpers/formatNumber";
import moment from "moment";

export default function Table({
	columns,
	data,
	loading,
	className,
	rowKey,
	bordered = true,
	scroll = { x: "100%" },
	sticky = true,
	onLoadMore,
	hasMore = true,
	...props
}: {
	columns: ColumnsTypes[];
	data: unknown[];
	loading?: boolean;
	className?: string;
	rowKey?: string;
	bordered?: boolean;
	scroll?: { x?: string | number; y?: string | number };
	sticky?: boolean;
	onLoadMore?: () => void;
	hasMore?: boolean;
	[key: string]: unknown;
}) {
	const darkMode = false;

	const { scrollRef } = useInfiniteScroll({
		onLoadMore: () => onLoadMore(),
		hasMore: hasMore,
		loading: loading,
		threshold: 50,
	});

	const mappedColumns = columns.map((column) => ({
		...column,
		render: column.render
			? column.render
			: column.type && column.type === "number"
			? (text: number) => formatNumber(text)
			: column.type && column.type === "date"
			? (text: string) => moment(text).format("DD.MM.YYYY")
			: column.render || ((text: string) => <span className="text-center">{text}</span>),
		align: column.align || "center",
	}));

	return (
		<div className="rounded-lg shadow-md ">
			<ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
				<div ref={scrollRef} className="w-full">
					<AntTable
						columns={mappedColumns}
						dataSource={data}
						className={`custom-small-body  cursor-pointer ${className || ""}`}
						loading={loading}
						rowKey={rowKey}
						pagination={false}
						bordered={bordered}
						scroll={scroll}
						sticky={sticky}
						{...props}
					/>
				</div>
			</ConfigProvider>
		</div>
	);
}
