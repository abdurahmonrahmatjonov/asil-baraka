import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { debouncedSet } from "@/helpers/debounce";
import { useGet } from "@/hooks/useGet";
import type { ItemGroupTypes, ItemTypes, WhsTypes } from "@/types/api/index";
import { generateUrlWithParams } from "@/lib/helpers";
import Table from "@/components/ui/Table";
import Filter from "@/components/ui/Filter";
import "./main.css";
import type { FilterTypes } from "@/components/ui/Filter/types";
import type { ReportsResDataTypes } from "@/types/api/Reports";
import Button from "@/components/ui/Button";

const Reports = () => {
	const { t } = useLanguage("tab.reports");

	const [itemName, setItemName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [searchItemName, setSearchItemName] = useState<string>("");
	const [selectedItem, setSelectedItem] = useState("");
	const [group, setGroup] = useState("");

	const { data: reportsData = [], isLoading } = useGet<ReportsResDataTypes[]>(
		["inventoryItems", "items/inventory-items", selectedItem, group, startDate, endDate],
		generateUrlWithParams("items/inventory-items", {
			pageSize: 100000,
			itemName: selectedItem,
			groupCode: group,
			startDate: String(startDate),
			endDate: String(endDate),
			skip: 0,
		})
	);

	const { data: itemsData = [] } = useGet<ItemTypes[]>(
		["slp", "items/items", searchItemName, 100000, 0, group],
		generateUrlWithParams("items/items", {
			itemName: String(searchItemName),
			pageSize: 100000,
			skip: 0,
			groupCode: group,
		})
	);

	const { data: itemsGroup = [] } = useGet<ItemGroupTypes[]>(
		["slp", "items/groups"],
		generateUrlWithParams("items/groups", {})
	);

	const optionsItemName = itemsData.map((item) => ({
		value: item.itemCode,
		label: item.itemName,
		data: item,
	}));

	const groupOptions = itemsGroup.map((item) => ({
		value: item.itmsGrpCod,
		label: item.itmsGrpNam,
	}));

	const columns = [
		{
			title: t("itemName"),
			dataIndex: "itemName",
			key: "itemName",
			width: 300,
			// fixed: "left",
		},
		{
			title: t("initialBalance"),
			dataIndex: "initialBalance",
			key: "initialBalance",
			type: "number",
		},
		{
			title: t("incomingQty"),
			dataIndex: "incomingQty",
			key: "incomingQty",
			type: "number",
		},
		{
			title: t("outgoingQty"),
			dataIndex: "outgoingQty",
			key: "outgoingQty",
			type: "number",
		},
		{
			title: t("returnedQty"),
			dataIndex: "returnedQty",
			key: "returnedQty",
			type: "number",
		},
		{
			title: t("fakt"),
			dataIndex: "fakt",
			key: "fakt",
			type: "number",
		},
		{
			title: t("groupName"),
			dataIndex: "itmsGrpNam",
			key: "itmsGrpNam",
		},
	];

	const filters: FilterTypes[] = [
		{
			title: t("searchItemName"),
			type: "autocomplete",
			options: optionsItemName,
			placeholder: t("searchItemName"),
			onSelect: (value: string, label: any) => {
				setSearchItemName(label.label);
				setSelectedItem(label.label);
				setItemName(label.label);
			},
			onSearch: (value: string) => {
				setItemName(value);
				debouncedSet(setSearchItemName, value);
				if (value === "") {
					setSelectedItem("");
				}
			},
			className: "min-w-[350px]",
			value: itemName,
		},
		{
			title: t("searchGroup"),
			type: "select",
			options: groupOptions,
			className: "min-w-[200px]",
			onChange: (value) => {
				setGroup(value as string);
			},
			value: group as string,
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
		setSearchItemName("");
		setItemName("");
		setSelectedItem("");
		setGroup("");
		setStartDate("");
		setEndDate("");
	};

	const handleNavigatePrint = () => {
		sessionStorage.setItem("reportsPDFData", JSON.stringify(reportsData));
		window.open(`/pdf/reports`, "_blank");
	};

	return (
		<div className="w-full  px-2 pt-3 rounded-lg rounded-tl-none  bg-white  shadow-md">
			<Filter filters={filters} onClick={onClearFilters} />

			<div className="my-5">
				<div className="flex items-center justify-end mb-5">
					<Button
						className="bg-primary text-white hover:!bg-red-400 hover:!text-white"
						hasShadow={false}
						onClick={handleNavigatePrint}
					>
						{t("printA4Pdf")}
					</Button>
				</div>
				<Table
					columns={columns as any}
					data={reportsData}
					pagination={false}
					className="w-full  my-custom-table "
					rowKey="zakaz"
					bordered
					// scroll={{ x: 1500 }}
					sticky={true}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};

export default Reports;
