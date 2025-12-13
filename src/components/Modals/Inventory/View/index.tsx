import React, { useState, useEffect } from "react";

import moment from "moment";
import { Modal } from "antd";
import Table from "@/components/ui/Table";
import SimpleButton from "@/components/ui/SimpleButton";
import AutoComplete from "@/components/ui/AutoComplete";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLanguage } from "@/hooks/useLanguage";
import { useGet } from "@/hooks/useGet";
import useSendRequest from "@/hooks/useSubmitData";
import { debouncedSet } from "@/helpers/debounce";
import formatNumber, { removeSpaces } from "@/helpers/formatNumber";
import { generateUrlWithParams } from "@/lib/helpers";
import { getCookie } from "@/lib/actions";

import type { ColumnsTypes } from "@/components/ui/Table/types";
import type { GetMeTypes } from "@/types/api/Auth";
import type { ViewModalType } from "../../BussinessPartners/Create/types";
import type { ItemTypes } from "@/types/api/index";
import type { InventoryLinesTypes, InventoryResDataTypes } from "@/types/api/Inventory";

export default function ViewInventory({
	isOpen,
	onClose,
	data: selectedData,
	isShowChangeBtn,
}: ViewModalType) {
	const { t } = useLanguage("tab.sales");
	const getMe: GetMeTypes = getCookie("get_me");

	const { isSending, sendRequest } = useSendRequest();

	const [docLines, setDocLines] = useState<InventoryLinesTypes[]>([]);
	const [data, setData] = useState<InventoryResDataTypes | null>(null);
	const [isChange, setIsChange] = useState(false);
	const [searchItemName, setSearchItemName] = useState<string>("");

	const biggestLineNum = docLines.reduce((max, line) => {
		return line.lineNum > max ? line.lineNum : max;
	}, 0);

	useEffect(() => {
		if (selectedData) {
			setData(selectedData);
			setDocLines(selectedData.documentLines || []);
		}
		if (selectedData?.documentLines) {
			setDocLines(selectedData.documentLines || []);
		}
	}, [selectedData, isOpen]);

	const { data: itemsData = [] } = useGet<ItemTypes[]>(
		["items", "items/items", searchItemName, 100000, 0],
		generateUrlWithParams("items/items", {
			itemName: String(searchItemName),
			pageSize: 100000,
			skip: 0,
			warehouseCode: getMe?.wareHouse || "",
		})
	);

	if (!data) {
		return null;
	}

	const optionsItemName = itemsData.map((item) => ({
		value: item.itemCode,
		label: item.itemName,
		data: item,
	}));

	const handleSearchItem = (value: string, index: number) => {
		debouncedSet(setSearchItemName, value);
		const updatedDocLines = [...docLines];
		if (value === "") {
			updatedDocLines[index].itemCode = "";
		}
		updatedDocLines[index].itemDescription = value;
		setDocLines(updatedDocLines);
	};

	const handleSelectItem = (value: string | number, label: any, index: number) => {
		setSearchItemName("");
		const updatedDocLines = [...docLines];
		updatedDocLines[index].itemCode = value as string;
		updatedDocLines[index].itemDescription = label.label;
		updatedDocLines[index].uomName = label.data.uomName;
		setDocLines(updatedDocLines);
	};

	const columns: ColumnsTypes[] = [
		{
			title: t("itemName"),
			dataIndex: "itemDescription",
			key: "itemDescription",
			width: 350,
			render: (text, record, index) => {
				return isChange ? (
					<AutoComplete
						className="w-[300px]"
						placeholder="Search items..."
						options={optionsItemName}
						onSearch={(value) => {
							handleSearchItem(value, index);
						}}
						onSelect={(value, label) => {
							handleSelectItem(value, label, index);
						}}
						value={record.itemDescription}
					/>
				) : (
					<span>{text}</span>
				);
			},
		},
		{
			title: t("countQty"),
			dataIndex: "countQty",
			key: "countQty",
			render: (text, record, index) => {
				return isChange ? (
					<Input
						type="text"
						value={formatNumber(text) as string}
						className="!min-w-24"
						onChange={(e) => {
							const updatedDocLines = [...docLines];
							updatedDocLines[index].countQty = removeSpaces(e.target.value);
							setDocLines(updatedDocLines);
						}}
					/>
				) : (
					<span className="text-center">{formatNumber(parseFloat(text).toFixed(2))}</span>
				);
			},
		},
		{
			title: t("inWhsQty"),
			dataIndex: "inWhsQty",
			key: "inWhsQty",
			type: "number",
		},
		{ title: t("uomName"), dataIndex: "uomName", key: "uomName" },
	];

	if (isChange) {
		columns.splice(0, 0, {
			title: t("actions"),
			dataIndex: "actions",
			key: "actions",
			width: 120,
			render: (text, record, index) => {
				return (
					<div className="flex gap-2 items-center justify-center">
						<SimpleButton
							type="secondary"
							className="h-8 !w-10"
							rounded="lg"
							content="+"
							onClick={handleAddRow}
						/>

						{docLines.length > 1 && (
							<SimpleButton
								type="primary"
								className="h-8 !w-10"
								rounded="lg"
								content="-"
								onClick={() => handleRemoveRow(index)}
							/>
						)}
					</div>
				);
			},
		});
	}

	const handleChange = () => {
		if (!isChange) {
			setIsChange(true);
		} else {
			patchData();
		}
	};

	const patchData = () => {
		const inventoryCountingLines = docLines.map((line) => {
			return {
				lineNumber: line.lineNum,
				itemCode: line.itemCode,
				warehouseCode: data.documentLines[0].whsCode,
				countedQuantity: +removeSpaces(line.countQty),
			};
		});

		const body = {
			inventoryCountingLines,
		};
		sendRequest({
			url: "/inventorycountings/" + data.docEntry,
			data: body,
			method: "PATCH",
			successMessage: t("success"),
			errorMessage: t("error"),
			showSuccessModal: true,
			showErrorModal: true,
			additionalFn: onCloseModal,
		});
	};

	const handleAddRow = () => {
		const updatedDocLines = [...docLines];
		updatedDocLines.push({
			lineNum: biggestLineNum + 1,
		});
		setDocLines(updatedDocLines);
	};

	const handleRemoveRow = (index: number) => {
		const updatedDocLines = [...docLines];
		updatedDocLines.splice(index, 1);
		setDocLines(updatedDocLines);
	};

	const onCloseModal = () => {
		resetState();
		onClose();
	};

	const resetState = () => {
		setIsChange(false);
	};

	return (
		<Modal
			centered
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onCloseModal}
			onCancel={onCloseModal}
			footer={null}
			width={"80%"}
			title={
				<h1 className="font-nunito text-xl font-extrabold text-[#000000]">
					{t("docNum")} : {selectedData?.docNum}
				</h1>
			}
		>
			<div className="mt-5">
				<div className="flex flex-wrap gap-5 mb-5">
					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("whs")}</span>
						<Input className="min-w-[200px]" value={data?.documentLines[0]?.whsName} disabled />
					</div>
					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("docDate")}</span>
						<Input
							className="w-[150px]"
							value={`${moment(data?.countDate).format("DD.MM.YYYY")}`}
							disabled
						/>
					</div>
				</div>
				<div className="mt-5">
					<Table columns={columns} data={docLines} />
				</div>

				<div className="flex justify-end gap-5 mt-5">
					{isShowChangeBtn && data.status === "O" && (
						<Button
							className="bg-secondary text-white hover:!bg-secondary/70 hover:!text-white"
							hasShadow={false}
							onClick={handleChange}
							loading={isSending}
						>
							{isChange ? t("saveChanges") : t("change")}
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
}
