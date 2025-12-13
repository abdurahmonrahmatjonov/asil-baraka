import { useState } from "react";

import { Eye } from "lucide-react";
import moment from "moment";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import ViewStocks from "@/components/Modals/Stocks/View";
import { useGet } from "@/hooks/useGet";
import { useLanguage } from "@/hooks/useLanguage";
import { generateUrlWithParams } from "@/lib/helpers";
import { getCookie } from "@/lib/actions";
import type { InventoryTRResType } from "@/types/api/StockTransfers";
import type { FilterTypes } from "@/components/ui/Filter/types";
import type { ColumnsTypes } from "@/components/ui/Table/types";

function IncomingProducts() {
	const { t } = useLanguage("tab.stocks");
	const getMe = getCookie("get_me");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
	const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
	const [selectedRowData, setSelectedRowData] = useState<InventoryTRResType>({});
	const [currentPage, setCurrentPage] = useState(0);
	const pageSize = 10;

	const {
		data = [],
		isLoading,
		refetch,
	} = useGet<InventoryTRResType[]>(
		["incomingProducts", "inventorytransferrequests", startDate, endDate],
		generateUrlWithParams("inventorytransferrequests", {
			startDate: String(startDate),
			endDate: String(endDate),
			documentStatus: "O",
			toWarehouseCode: getMe?.wareHouse,
		})
	);

	const columns: ColumnsTypes[] = [
		{
			title: t("docNum"),
			dataIndex: "docNum",
			key: "docNum",
		},

		{
			title: t("docDate"),
			dataIndex: "docDate",
			key: "docDate",
			type: "date",
		},

		{
			title: t("fromWhs"),
			dataIndex: "fromWarehouseName",
			key: "fromWarehouseName",
		},
		{
			title: t("toWhs"),
			dataIndex: "toWarehouseName",
			key: "toWarehouseName",
		},

		{
			title: t("actions"),
			dataIndex: "actions",
			key: "actions",
			render: (_, record) => (
				<div className="flex items-center justify-center">
					<Button
						className="bg-primary text-white hover:!bg-red-400 hover:!text-white"
						hasShadow={false}
						onClick={() => {
							handleRowClick(record);
						}}
					>
						<Eye />
					</Button>
				</div>
			),
		},
	];

	const filters: FilterTypes[] = [
		{
			title: t("startDate"),
			type: "date",
			placeholder: "Выберите дату начала",
			onChange: (e) => {
				setStartDate(e.target.value);
			},
			value: startDate,
			minDate: "", // today
			maxDate: endDate,
		},
		{
			title: t("endDate"),
			type: "date",
			placeholder: "Выберите дату начала",
			onChange: (e) => {
				setEndDate(e.target.value);
			},
			value: endDate,
			minDate: startDate,
			maxDate: "", // today
		},
	];

	const onClearFilters = () => {
		setStartDate("");
		setEndDate("");
	};

	const handleRowClick = (record: InventoryTRResType) => {
		setSelectedRowData(record);
		setViewModalOpen(true);
	};

	const handleNextPage = () => {
		setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		setCurrentPage(currentPage - 1);
	};

	return (
		<div>
			<Section
				filters={filters}
				onClearFilters={onClearFilters}
				columns={columns}
				data={data}
				loading={isLoading}
				scrollTable={{ x: "1000px" }}
				isShowPaginationBtn={true}
				currentPage={currentPage + 1}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				isNextPageDisabled={data.length !== pageSize}
				isPrevPageDisabled={currentPage === 0}
			/>
			<ViewStocks
				isOpen={viewModalOpen}
				data={selectedRowData}
				onClose={() => {
					setViewModalOpen(false);
					refetch();
				}}
				isShowReceiveBtn
			/>
		</div>
	);
}

export default IncomingProducts;
