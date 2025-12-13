import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import type { ViewModalType } from "../../BussinessPartners/Create/types";
import Table from "@/components/ui/Table";
import { useLanguage } from "@/hooks/useLanguage";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import Input from "@/components/ui/Input";
import formatNumber from "@/helpers/formatNumber";
import Button from "@/components/ui/Button";
import moment from "moment";
import { useGet } from "@/hooks/useGet";
import type { ItemTypes } from "@/types/api/index";
import { generateUrlWithParams } from "@/lib/helpers";
import AutoComplete from "@/components/ui/AutoComplete";
import { debouncedSet } from "@/helpers/debounce";
import useSendRequest from "@/hooks/useSubmitData";
import type { InventoryTRLinesTypes } from "@/types/api/StockTransfers";

export default function ViewStocks({
	isOpen,
	onClose,
	data,
	isEditable,
	isShowReceiveBtn,
}: ViewModalType) {
	const { t } = useLanguage("tab.stocks");
	const { isSending, sendRequest } = useSendRequest();

	const [docLines, setDocLines] = useState<InventoryTRLinesTypes[]>([]);
	const [searchItemName, setSearchItemName] = useState<string>("");

	const initialDocLine: InventoryTRLinesTypes = {
		fromWarehouseCode: data?.fromWarehouse,
		fromWarehouseName: "",
		itemCode: "",
		itemDescription: "",
		lineNum: 0,
		quantity: 0,
		uoMCode: 0,
		uoMName: "",
		warehouseCode: "",
		warehouseName: "",
	};

	useEffect(() => {
		if (data?.stockTransferLines) {
			setDocLines(data.stockTransferLines || []);
		}
	}, [data, isOpen]);

	const { data: itemsData = [] } = useGet<ItemTypes[]>(
		["slp", "items/items", searchItemName, 100000, 0],
		generateUrlWithParams("items/items", {
			itemName: String(searchItemName),
			pageSize: 100000,
			skip: 0,
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

	const columns: ColumnsTypes[] = [
		{
			title: t("itemName"),
			dataIndex: "itemDescription",
			key: "itemDescription",
			render: (text, record, index) => {
				return isEditable ? (
					<AutoComplete
						className="w-[300px]"
						placeholder="Search items..."
						options={optionsItemName}
						onSearch={(value) => {
							handleSearchItem(value, index);
						}}
						onSelect={(value, label) => {
							handleSelectItem(value, label, index, record);
						}}
						value={record.itemDescription}
					/>
				) : (
					<span>{text}</span>
				);
			},
		},
		{
			title: t("quantity"),
			dataIndex: "quantity",
			key: "quantity",
			render: (text, record, index) => {
				return isEditable ? (
					<Input
						type="text"
						value={formatNumber(text) as string}
						className="!min-w-24"
						onChange={(e) => {
							const updatedDocLines = [...docLines];
							updatedDocLines[index].quantity = e.target.value;

							setDocLines(updatedDocLines);
						}}
					/>
				) : (
					<span>{formatNumber(text)}</span>
				);
			},
		},
		{ title: t("ugpName"), dataIndex: "uoMName", key: "uoMName" },
	];

	const handleSearchItem = (value: string, index: number) => {
		debouncedSet(setSearchItemName, value);
		const updatedDocLines = [...docLines];
		if (value === "") {
			updatedDocLines[index].itemCode = "";
		}
		updatedDocLines[index].itemDescription = value;
		setDocLines(updatedDocLines);
	};

	const handleSelectItem = (value: string | number, label: any, index: number, record: any) => {
		console.log("label", label);
		// getItemsOnHand(value as string, index, record.whsCode as string);
		setSearchItemName("");
		const updatedDocLines = [...docLines];
		updatedDocLines[index].itemCode = value as string;
		updatedDocLines[index].itemDescription = label.label;
		updatedDocLines[index].uoMCode = label.data.uomEntry;
		updatedDocLines[index].uoMName = label.data.uoMName;
		setDocLines(updatedDocLines);
	};

	const handleAddRow = () => {
		const updatedDocLines = [...docLines];
		updatedDocLines.push(initialDocLine);
		setDocLines(updatedDocLines);
	};

	const handleRemoveRow = (index: number) => {
		const updatedDocLines = [...docLines];
		updatedDocLines.splice(index, 1);
		setDocLines(updatedDocLines);
	};

	const handleEdit = () => {
		const stockTransferLines = docLines.map((docLine) => {
			return {
				lineNum: docLine.lineNum,
				itemCode: docLine.itemCode,
				quantity: +docLine.quantity,
				warehouseCode: data.toWarehouse,
				uoMCode: docLine.uoMCode,
				fromWarehouseCode: data.fromWarehouse,
			};
		});
		const body = {
			stockTransferLines: stockTransferLines,
		};
		sendRequest({
			url: `inventorytransferrequests/${data.docEntry}`,
			data: body,
			method: "PATCH",
			successMessage: t("successEdited"),
			showSuccessModal: true,
			showErrorModal: true,
			additionalFn: onCloseModal,
		});
	};

	const handleReceive = () => {
		const stockTransferLines = docLines.map((docLine, index) => {
			return {
				lineNum: index,
				itemCode: docLine.itemCode,
				quantity: +docLine.quantity,
				warehouseCode: docLine.warehouseCode,
				fromWarehouseCode: data.fromWarehouse,
				baseEntry: data.docEntry,
				baseLine: docLine.lineNum,
				baseType: "InventoryTransferRequest",
			};
		});
		const body = {
			docDate: data.docDate,
			dueDate: data.docDate,
			toWarehouse: data.toWarehouse,
			stockTransferLines: stockTransferLines,
		};
		sendRequest({
			url: `stocktransfers`,
			data: body,
			method: "POST",
			successMessage: t("successReceived"),
			showSuccessModal: true,
			showErrorModal: true,
			additionalFn: onCloseModal,
		});
	};

	const onCloseModal = () => {
		resetState();
		onClose();
	};

	const resetState = () => {
		setDocLines([]);
		setSearchItemName("");
	};

	return (
		<Modal
			centered
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onClose}
			onCancel={onClose}
			footer={null}
			width={"80%"}
			title={
				<h1 className="font-nunito text-xl font-extrabold text-[#000000]">
					{t("docNum")} : {data?.docNum}
				</h1>
			}
		>
			<div className="mt-5">
				<div className="flex flex-wrap gap-5 mb-5">
					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("fromWhs")}</span>
						<Input className="w-[200px]" value={data?.fromWarehouseName} disabled />
					</div>
					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("toWhs")}</span>
						<Input className="w-[200px]" value={data?.toWarehouseName} disabled />
					</div>

					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("docDate")}</span>
						<Input value={moment(data?.docDate).format("DD.MM.YYYY")} disabled />
					</div>
				</div>
				<div className="mt-5">
					<Table columns={columns} data={docLines} />
				</div>

				<div className="flex justify-end gap-5 mt-5">
					{isEditable && (
						<Button
							className="bg-secondary text-white hover:!bg-secondary/70 hover:!text-white"
							hasShadow={false}
							onClick={handleEdit}
							loading={isSending}
						>
							{t("edit")}
						</Button>
					)}

					{isShowReceiveBtn && (
						<Button
							className="bg-secondary text-white hover:!bg-secondary/70 hover:!text-white"
							hasShadow={false}
							onClick={handleReceive}
							loading={isSending}
						>
							{t("receive")}
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
}
