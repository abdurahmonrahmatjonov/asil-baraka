import { useState } from "react";

import { Eye } from "lucide-react";
import Section from "@/components/ui/Section";
import AddSales from "@/components/Modals/Sales/AddSales";
import ViewSales from "@/components/Modals/Sales/ViewSales";
import Button from "@/components/ui/Button";
import { useGet } from "@/hooks/useGet";
import { useLanguage } from "@/hooks/useLanguage";
import { debouncedSet } from "@helpers/debounce";
import formatNumber from "@/helpers/formatNumber";
import { generateUrlWithParams } from "@/lib/helpers";

import type { FilterTypes } from "@/components/ui/Filter/types";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import type { SalesDataTypes, SalesResponseTypes } from "@/types/api/Sales";
import type { BpTypes } from "@/types/api/";

function FinishedSales() {
	const { t } = useLanguage("tab.sales");

	const [cardName, setCardName] = useState("");
	const [searchCardName, setSearchCardName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [slpCode, setSlpCode] = useState<string | number>("");
	const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
	const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
	const [selectedRowData, setSelectedRowData] = useState<SalesDataTypes>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [docStatus] = useState("O");
	const [salesCardName, setSalesCardName] = useState("");
	const [pageSize, setPageSize] = useState(10);

	const {
		data: salesOrderData = [],
		isLoading,
		refetch,
	} = useGet<SalesResponseTypes[]>(
		[
			"finishedSalesInvoices",
			"sales/sales-invoices",
			salesCardName,
			startDate,
			endDate,
			slpCode,
			docStatus,
			currentPage,
			pageSize,
		],
		generateUrlWithParams("sales/sales-invoices", {
			cardName: String(salesCardName),
			startDate: String(startDate),
			endDate: String(endDate),
			slpCode: String(slpCode),
			docStatus: String(docStatus),
			skip: currentPage,
			pageSize: pageSize,
		})
	);

	const { data: bpData = [] } = useGet<BpTypes[]>(
		["businessPartners", "businesspartners", searchCardName],
		generateUrlWithParams("businesspartners", {
			cardName: String(searchCardName),
			cardType: "C",
		})
	);

	const { data: slpData = [] } = useGet<BpTypes[]>(
		["slp", "salesemployees", searchCardName],
		generateUrlWithParams("salesemployees", {})
	);

	const columns: ColumnsTypes[] = [
		{
			title: t("docNum"),
			dataIndex: "docNum",
			key: "docNum",
		},
		{
			title: t("cardName"),
			dataIndex: "cardName",
			key: "cardName",
		},
		{
			title: t("docDate"),
			dataIndex: "docDate",
			key: "docDate",
		},

		// {
		// 	title: t("docTotal"),
		// 	dataIndex: "docTotal",
		// 	key: "docTotal",
		// 	type: "number",
		// 	render: (text, record: SalesDataTypes) => `${formatNumber(text)} 	${record.docCurrency}`,
		// },

		// {
		// 	title: t("slpName"),
		// 	dataIndex: "slpName",
		// 	key: "slpName",
		// },
		{
			title: t("whs"),
			dataIndex: "whsName",
			key: "whsName",
			render: (text, record: SalesDataTypes) => {
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

	const bpOptions = bpData?.map((bp) => ({
		value: bp.cardCode,
		label: bp.cardName,
	}));

	const slpOptions = slpData.map((whs) => ({
		value: whs.slpCode,
		label: whs.slpName,
	}));

	// const docStatusOptions = [
	// 	{
	// 		value: "",
	// 		label: t("all"),
	// 	},
	// 	{
	// 		value: "O",
	// 		label: t("open"),
	// 	},
	// 	{
	// 		value: "C",
	// 		label: t("closed"),
	// 	},
	// ];

	const filters: FilterTypes[] = [
		{
			title: t("searchByCardName"),
			type: "autocomplete",
			options: bpOptions,
			placeholder: "Введите название клиента",
			onSelect: (value, label) => {
				setSalesCardName(label.label);
				setSearchCardName("");
				setCardName(label.label);
			},
			onSearch: (value) => {
				debouncedSet(setSearchCardName, value);
				setCardName(value);
				if (value === "") {
					setSalesCardName("");
				}
			},
			className: "min-w-[250px]",
			value: cardName,
		},
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
		// {
		// 	title: t("slpName"),
		// 	type: "select",
		// 	options: slpOptions,
		// 	placeholder: "Введите название 	менеджера",
		// 	onChange: (value) => {
		// 		setSlpCode((value as string) || "");
		// 	},
		// 	value: slpCode as string,
		// },
		// {
		// 	title: t("docStatus"),
		// 	type: "select",
		// 	options: docStatusOptions,
		// 	onChange: (value) => {
		// 		setDocStatus((value as string) || "");
		// 	},
		// 	value: docStatus as string,
		// },
	];

	const onClearFilters = () => {
		setStartDate("");
		setEndDate("");
		setSlpCode("");
		setCardName("");
		setSalesCardName("");
		setSearchCardName("");
	};

	const handleRowClick = (record: SalesDataTypes) => {
		setSelectedRowData(record);
		setViewModalOpen(true);
	};

	const handleNextPage = () => {
		setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		setCurrentPage(currentPage - 1);
	};

	const handleAddBtnClick = () => {
		setAddModalOpen(true);
	};

	const handlePageSizeChange = (value: number) => {
		setPageSize(value);
		setCurrentPage(0);
	};

	return (
		<div>
			<Section
				filters={filters}
				onClearFilters={onClearFilters}
				columns={columns}
				data={salesOrderData}
				loading={isLoading}
				isShowPaginationBtn={true}
				currentPage={currentPage + 1}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				isNextPageDisabled={salesOrderData.length !== pageSize}
				isPrevPageDisabled={currentPage === 0}
				showAddBtn
				handleAddBtnClick={handleAddBtnClick}
				addBtnText={t("add")}
				isShowPageSize
				handlePageSizeChange={handlePageSizeChange}
				pageSize={pageSize}
			/>
			<ViewSales
				isOpen={viewModalOpen}
				data={selectedRowData}
				onClose={() => {
					refetch();
					setViewModalOpen(false);
				}}
				isShowPdfBtn
			/>
			<AddSales
				isOpen={addModalOpen}
				onClose={() => {
					refetch();
					setAddModalOpen(false);
				}}
			/>
		</div>
	);
}

export default FinishedSales;
