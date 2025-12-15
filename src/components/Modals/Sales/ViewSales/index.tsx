import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import type { ViewModalType } from "../../BussinessPartners/Create/types";
import Table from "@/components/ui/Table";
import { useLanguage } from "@/hooks/useLanguage";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import Input from "@/components/ui/Input";
import formatNumber, { formatNumberInput, removeSpaces } from "@/helpers/formatNumber";
import Button from "@/components/ui/Button";
import useSendRequest from "@/hooks/useSubmitData";
import type { DocLineType } from "../AddSales/types";
import moment from "moment";
import type { SalesDataTypes } from "@/types/api/Sales";
import AutoComplete from "@/components/ui/AutoComplete";
import { useGet } from "@/hooks/useGet";
import { generateUrlWithParams } from "@/lib/helpers";
import type { ItemTypes } from "@/types/api/index";
import { debouncedSet } from "@/helpers/debounce";
import SimpleButton from "@/components/ui/SimpleButton";

export default function ViewSales({
	isOpen,
	onClose,
	data,
	isShowChangeBtn,
	isShowCopyToInvoiceBtn,
	isShowPdfBtn,
}: ViewModalType) {
	const { t } = useLanguage("tab.sales");

	const { isSending: isCopySending, sendRequest: sendCopyRequest } = useSendRequest();
	const { isSending: isChangeSending, sendRequest: sendChangeRequest } = useSendRequest();

	const [docLines, setDocLines] = useState<DocLineType[]>([]);
	const [isChange, setIsChange] = useState(false);
	const [searchItemName, setSearchItemName] = useState<string>("");
	const biggestLineNum = docLines.reduce((max, line) => {
		return line.lineNum > max ? line.lineNum : max;
	}, 0);
	useEffect(() => {
		if (data?.documentLines) {
			setDocLines(data.documentLines || []);
		}
	}, [data]);

	const { data: itemsData = [] } = useGet<ItemTypes[]>(
		["items", "items/items", searchItemName, 100000, 0],
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
		// getItemsOnHand(value as string, index, record.whsCode as string);
		setSearchItemName("");
		const updatedDocLines = [...docLines];
		updatedDocLines[index].itemCode = value as string;
		updatedDocLines[index].itemDescription = label.label;
		updatedDocLines[index].price = label.data.price;
		updatedDocLines[index].ugpName = label.data.uomName;
		setDocLines(updatedDocLines);
	};

	const handleAddRow = () => {
		const updatedDocLines = [...docLines];
		updatedDocLines.push({
			lineNum: biggestLineNum + 1,
			itemDescription: "",
			itemCode: "",
			quantity: 0,
			price: 0,
			currency: data.docCurrency,
			whsCode: docLines[0]?.whsCode,
			whsName: docLines[0]?.whsName,
		});
		setDocLines(updatedDocLines);
	};

	const handleRemoveRow = (index: number) => {
		const updatedDocLines = [...docLines];
		updatedDocLines.splice(index, 1);
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
						className="w-[280px]"
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
			title: t("quantity"),
			dataIndex: "quantity",
			key: "quantity",
			render: (text, record, index) => {
				return isChange ? (
					<Input
						type="text"
						value={formatNumberInput(text) as string}
						className="!min-w-24"
						onChange={(e) => {
							const updatedDocLines = [...docLines];
							updatedDocLines[index].quantity = removeSpaces(e.target.value);
							setDocLines(updatedDocLines);
						}}
					/>
				) : (
					<span className="text-center">{formatNumber(text)}</span>
				);
			},
		},
		{ title: t("uomName"), dataIndex: "ugpName", key: "ugpName" },

		// {
		// 	title: t("price"),
		// 	dataIndex: "price",
		// 	key: "price",
		// 	type: "number",
		// 	render: (text, record, index) => {
		// 		return isChange ? (
		// 			<Input
		// 				type="text"
		// 				value={formatNumberInput(text) as string}
		// 				className="!min-w-24"
		// 				onChange={(e) => {
		// 					const updatedDocLines = [...docLines];
		// 					updatedDocLines[index].price = removeSpaces(e.target.value);
		// 					setDocLines(updatedDocLines);
		// 				}}
		// 			/>
		// 		) : (
		// 			<span className="text-center">{formatNumber(text)}</span>
		// 		);
		// 	},
		// 	// render: (text, record: DocLineType) => (
		// 	// 	<span>{`${formatNumber(text)} ${record.currency ?? ""}`}</span>
		// 	// ),
		// },
		{ title: t("whsName"), dataIndex: "whsName", key: "whsName" },

		// {
		// 	title: t("lineTotal"),
		// 	dataIndex: "lineTotal",
		// 	key: "lineTotal",
		// 	render: (text, record: DocLineType) => (
		// 		<span>{`${formatNumberInput(
		// 			+removeSpaces(record.quantity) * +removeSpaces(record.price)
		// 		)} ${record.currency ?? ""}`}</span>
		// 	),
		// },
	];
	if (isChange) {
		columns.push({
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
			const documentLines = docLines.map((line) => {
				return {
					lineNum: line.lineNum,
					itemCode: line.itemCode,
					unitPrice: +removeSpaces(line.price),
					quantity: +removeSpaces(line.quantity),
					currency: line.currency,
				};
			});

			const body = {
				docDueDate: moment(data.docDate, "DD.MM.YYYY").format("YYYY-MM-DD"),
				documentLines,
			};
			sendChangeRequest({
				url: `/sales/orders/${data.docEntry}`,
				data: body,
				method: "PATCH",
				successMessage: t("successEdited"),
				errorMessage: t("error"),
				showSuccessModal: true,
				showErrorModal: true,
				additionalFn: onCloseModal,
			});
		}
	};

	const handleCopyToInvoice = () => {
		const documentLines = docLines.map((line, index) => {
			return {
				lineNum: index,
				itemCode: line.itemCode,
				unitPrice: +removeSpaces(line.price),
				quantity: +removeSpaces(line.quantity),
				currency: line.currency ?? "",
				warehouseCode: line.warehouseCode,
				baseType: 17,
				baseLine: line.lineNum,
				baseEntry: data.docEntry,
				discountPercent: line.discountPercent || 0,
			};
		});

		const body = {
			cardCode: data.cardCode,
			docDueDate: moment(data.docDate, "DD.MM.YYYY").format("YYYY-MM-DD"),
			docDate: moment(data.docDate, "DD.MM.YYYY").format("YYYY-MM-DD"),
			docCurrency: data.docCurrency,
			salesPersonCode: data.slpCode || "-1",
			comments: data.comments || "",
			docRate: data.docRate,
			discountPercent: data?.discountPercent || 0,
			documentLines,
		};
		sendCopyRequest({
			url: `sales/sales-invoices`,
			data: body,
			method: "POST",
			successMessage: t("successCopied"),
			errorMessage: t("error"),
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
		setIsChange(false);
	};

	const handleNavigatePrint = (record: SalesDataTypes) => {
		sessionStorage.setItem("orderPDFData", JSON.stringify(record));
		window.open(`/pdf/sales/${record.docEntry}`, "_blank");
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
					{t("docNum")} : {data?.docNum}
				</h1>
			}
		>
			<div className="mt-5">
				<div className="flex flex-wrap gap-5 mb-5">
					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("cardName")}</span>
						<Input className="min-w-[200px]" value={data?.cardName} disabled />
					</div>
					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("slpName")}</span>
						<Input className="min-w-[200px]" value={data?.slpName} disabled />
					</div>

					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("docDate")}</span>
						<Input value={data?.docDate} disabled />
					</div>

					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("docTotal")}</span>
						<Input value={`${formatNumber(data?.docTotal)} ${data?.docCurrency}`} disabled />
					</div>
				</div>
				<div className="mt-5">
					<Table columns={columns} data={docLines} />
				</div>

				<div className="flex justify-end gap-5 mt-5">
					{isShowPdfBtn && (
						<Button
							className="bg-primary text-white hover:!bg-red-400 hover:!text-white"
							hasShadow={false}
							onClick={() => {
								handleNavigatePrint(data);
							}}
						>
							{t("printA4Pdf")}
						</Button>
					)}
					{isShowChangeBtn && data.docStatus === "O" && (
						<Button
							className="bg-secondary text-white hover:!bg-secondary/70 hover:!text-white"
							hasShadow={false}
							onClick={handleChange}
							loading={isChangeSending}
						>
							{isChange ? t("saveChanges") : t("change")}
						</Button>
					)}

					{isShowCopyToInvoiceBtn && data.docStatus === "O" && (
						<Button
							className="bg-secondary text-white hover:!bg-secondary/70 hover:!text-white"
							hasShadow={false}
							onClick={handleCopyToInvoice}
							loading={isCopySending}
							disabled={isChange}
						>
							{t("copyToInvoice")}
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
}
