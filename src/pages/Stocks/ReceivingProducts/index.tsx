import { useState } from "react";

import moment from "moment";

import { Eye } from "lucide-react";
import Section from "@/components/ui/Section";
import ViewStocks from "@/components/Modals/Stocks/View";
import Button from "@/components/ui/Button";
import { useGet } from "@/hooks/useGet";
import { useLanguage } from "@/hooks/useLanguage";
import { getCookie } from "@/lib/actions";
import { generateUrlWithParams } from "@/lib/helpers";

import type { InventoryTRResType } from "@/types/api/StockTransfers";
import type { FilterTypes } from "@/components/ui/Filter/types";
import type { ColumnsTypes } from "@/components/ui/Table/types";

function ReceivingProducts() {
	const { t } = useLanguage("tab.stocks");
	const getMe = getCookie("get_me");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
	const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
	const [selectedRowData, setSelectedRowData] = useState<InventoryTRResType>({});
	const [currentPage, setCurrentPage] = useState(0);
	const pageSize = 10;

	const { data = [], isLoading } = useGet<InventoryTRResType[]>(
		["receivingProducts", "stocktransfers", startDate, endDate],
		generateUrlWithParams("stocktransfers", {
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
				// rowClassName={(record, index) => (index % 2 === 0 ? "bg-green-100" : "bg-white")}
			/>
			<ViewStocks
				isOpen={viewModalOpen}
				data={selectedRowData}
				onClose={() => {
					setViewModalOpen(false);
				}}
			/>
		</div>
	);
}

export default ReceivingProducts;
