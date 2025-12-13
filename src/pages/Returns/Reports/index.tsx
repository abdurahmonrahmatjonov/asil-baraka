import { useState } from "react";

import Section from "@/components/ui/Section";
import { useLanguage } from "@/hooks/useLanguage";
import { useGet } from "@/hooks/useGet";
import { generateUrlWithParams } from "@/lib/helpers";

import type { ColumnsTypes } from "@/components/ui/Table/types";
import type { FilterTypes } from "@/components/ui/Filter/types";
import type { ReturnReportsResponseTypes } from "@/types/api/Returns";

function ReturnReports() {
	const { t } = useLanguage("tab.return");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [currentPage, setCurrentPage] = useState(0);

	const pageSize = 10;

	const { data: salesReportsData = [], isLoading } = useGet<ReturnReportsResponseTypes[]>(
		["returnReports", "sales/credit-notes/reports", startDate, endDate, currentPage, pageSize],
		generateUrlWithParams("sales/credit-notes/reports", {
			startDate: String(startDate),
			endDate: String(endDate),
			skip: currentPage,
			pageSize: pageSize,
		})
	);

	const columns: ColumnsTypes[] = [
		{
			title: t("itemCode"),
			dataIndex: "itemCode",
			key: "itemCode",
		},
		{
			title: t("itemName"),
			dataIndex: "itemName",
			key: "itemName",
		},
		{
			title: t("quantity"),
			dataIndex: "quantity",
			key: "quantity",
			type: "number",
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
				data={salesReportsData}
				loading={isLoading}
				isShowPaginationBtn={true}
				currentPage={currentPage + 1}
				handleNextPage={handleNextPage}
				handlePrevPage={handlePrevPage}
				isNextPageDisabled={salesReportsData.length !== pageSize}
				isPrevPageDisabled={currentPage === 0}
			/>
		</div>
	);
}

export default ReturnReports;
