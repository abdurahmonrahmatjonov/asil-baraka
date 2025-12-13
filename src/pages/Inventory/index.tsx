import { useState } from "react";

import { Eye } from "lucide-react";
import moment from "moment";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import AddInventory from "@/components/Modals/Inventory/Add";
import ViewInventory from "@/components/Modals/Inventory/View";
import { generateUrlWithParams } from "@/lib/helpers";
import { useGet } from "@/hooks/useGet";
import { useLanguage } from "@/hooks/useLanguage";

import type { ColumnsTypes } from "@/components/ui/Table/types";
import type { FilterTypes } from "@/components/ui/Filter/types";
import type { InventoryResDataTypes } from "@/types/api/Inventory";

function Inventory() {
	const { t } = useLanguage("tab.sales");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
	const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
	const [selectedRowData, setSelectedRowData] = useState<InventoryResDataTypes>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [docStatus, setDocStatus] = useState("");

	const pageSize = 10;

	const {
		data: salesOrderData = [],
		isLoading,
		refetch,
	} = useGet<InventoryResDataTypes[]>(
		[
			"inventorycountings",
			"inventorycountings",
			startDate,
			endDate,
			docStatus,
			currentPage,
			pageSize,
		],
		generateUrlWithParams("inventorycountings", {
			startDate: String(startDate),
			endDate: String(endDate),
			status: String(docStatus),
			skip: currentPage,
			pageSize: pageSize,
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
			dataIndex: "countDate",
			key: "countDate",
			type: "date",
			render: (text) => `${moment(text).format("DD.MM.YYYY")}`,
		},
		// {
		// 	title: t("takerName"),
		// 	dataIndex: "takerName",
		// 	key: "takerName",
		// },

		{
			title: t("whs"),
			dataIndex: "whsName",
			key: "whsName",
			render: (text, record: InventoryResDataTypes) => {
				return record?.documentLines?.[0]?.whsName || "";
			},
		},
		{
			title: t("actions"),
			dataIndex: "actions",
			key: "actions",
			render: (_, record) => (
				<div className="flex items-center justify-center">
					<Button
						className="bg-primary  text-white hover:!bg-red-400 hover:!text-white"
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

	const docStatusOptions = [
		{
			value: "",
			label: t("all"),
		},
		{
			value: "O",
			label: t("open"),
		},
		{
			value: "C",
			label: t("closed"),
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

		{
			title: t("docStatus"),
			type: "select",
			options: docStatusOptions,
			onChange: (value) => {
				setDocStatus((value as string) || "");
			},
			value: docStatus as string,
		},
	];

	const onClearFilters = () => {
		setStartDate("");
		setEndDate("");
		setDocStatus("");
	};

	const handleRowClick = (record: InventoryResDataTypes) => {
		setSelectedRowData(record);
		setViewModalOpen(true);
	};

	const handleAddBtnClick = () => {
		setAddModalOpen(true);
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
				data={salesOrderData}
				loading={isLoading}
				showAddBtn
				handleAddBtnClick={handleAddBtnClick}
				addBtnText={t("add")}
				isShowPaginationBtn={true}
				currentPage={currentPage + 1}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				isNextPageDisabled={salesOrderData.length !== pageSize}
				isPrevPageDisabled={currentPage === 0}
				rowClassName={(record: InventoryResDataTypes) =>
					record.status === "O" ? "bg-green-100" : "bg-red-100"
				}
			/>
			<ViewInventory
				isOpen={viewModalOpen}
				data={selectedRowData}
				onClose={() => {
					refetch();
					setViewModalOpen(false);
				}}
				isShowChangeBtn
				isShowPdfBtn
				isShowCopyToInvoiceBtn
			/>
			<AddInventory
				isOpen={addModalOpen}
				onClose={() => {
					refetch();
					setAddModalOpen(false);
				}}
			/>
		</div>
	);
}

export default Inventory;
