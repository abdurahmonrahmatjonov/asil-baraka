import { useState } from "react";

import { Eye } from "lucide-react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import ViewReturns from "@/components/Modals/Returns/View";
import { useGet } from "@/hooks/useGet";
import { useLanguage } from "@/hooks/useLanguage";
import { debouncedSet } from "@helpers/debounce";
import formatNumber from "@/helpers/formatNumber";
import { generateUrlWithParams } from "@/lib/helpers";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import type { FilterTypes } from "@/components/ui/Filter/types";
import type { ReturnResTypes, ReturnTypes } from "@/types/api/Returns";
import type { BpTypes } from "@/types/api/";

function ReturnHistory() {
	const { t } = useLanguage("tab.return");

	const [cardName, setCardName] = useState("");
	const [searchCardName, setSearchCardName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [slpCode, setSlpCode] = useState<string | number>("");
	const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
	const [selectedRowData, setSelectedRowData] = useState<ReturnTypes>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [docStatus] = useState("O");
	const [salesCardName, setSalesCardName] = useState("");

	const pageSize = 10;

	const {
		data = [],
		isLoading,
		refetch,
	} = useGet<ReturnResTypes[]>(
		[
			"creditNotes",
			"sales/credit-notes",
			salesCardName,
			startDate,
			endDate,
			slpCode,
			docStatus,
			currentPage,
			pageSize,
		],
		generateUrlWithParams("sales/credit-notes", {
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
		// 	render: (text, record: ReturnTypes) => `${formatNumber(text)} 	${record.docCurrency}`,
		// },

		{
			title: t("whs"),
			dataIndex: "whsName",
			key: "whsName",
			render: (text, record: ReturnTypes) => {
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
	];

	const onClearFilters = () => {
		setStartDate("");
		setEndDate("");
		setSlpCode("");
		setCardName("");
		setSalesCardName("");
		setSearchCardName("");
	};

	const handleRowClick = (record: ReturnTypes) => {
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
				isShowPaginationBtn={true}
				currentPage={currentPage + 1}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				isNextPageDisabled={data?.length !== pageSize}
				isPrevPageDisabled={currentPage === 0}
			/>
			<ViewReturns
				isOpen={viewModalOpen}
				data={selectedRowData}
				onClose={() => {
					refetch();
					setViewModalOpen(false);
				}}
			/>
		</div>
	);
}

export default ReturnHistory;
