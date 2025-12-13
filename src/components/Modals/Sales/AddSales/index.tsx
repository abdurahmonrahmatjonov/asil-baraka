import { memo, useEffect, useState } from "react";
import { Modal } from "antd";
import type { AddModalType } from "../../BussinessPartners/Create/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import AutoComplete from "@/components/ui/AutoComplete";
import Table from "@components/ui/Table";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import Button from "@/components/ui/Button";
import AddBp from "@components/Modals/BussinessPartners/Create";
import SimpleButton from "@/components/ui/SimpleButton";
import { useLanguage } from "@/hooks/useLanguage";
import { debouncedSet } from "@/helpers/debounce";
import formatNumber, { removeSpaces } from "@/helpers/formatNumber";
import type { DataType, DocLineType } from "./types";
import moment from "moment";
import { useGet } from "@/hooks/useGet";
import { generateUrlWithParams } from "@/lib/helpers";
import type { BpTypes, ItemTypes, WhsTypes } from "@/types/api/index";
import useSendRequest from "@/hooks/useSubmitData";
import TextArea from "antd/lib/input/TextArea";
import { getCookie } from "@/lib/actions";
import type { GetMeTypes } from "@/types/api/Auth";

const AddSales = ({ isOpen, onClose }: AddModalType) => {
	const getMe: GetMeTypes = getCookie("get_me");

	const initialDocLine: DocLineType = {
		itemCode: "",
		itemName: "",
		itemDescription: "",
		quantity: "",
		price: "",
		currency: "USD",
		whsName: "",
		lineTotal: "",
		whsCode: getMe?.wareHouse,
		lineNum: 0,
		itemGroup: "",
		ugpName: "",
	};

	const initialData: DataType = {
		cardName: "",
		cardCode: "",
		docDate: moment().format("YYYY-MM-DD"),
		docDueDate: moment().format("YYYY-MM-DD"),
		docRate: "",
		currency: "USD",
		slpCode: getMe?.salesPersonCode,
		slpName: "",
		comments: "",
		whsCode: "",
	};

	const { t } = useLanguage("tab.sales");
	const { isSending, sendRequest } = useSendRequest();

	const [data, setData] = useState<DataType>(initialData);
	const [docLines, setDocLines] = useState<DocLineType[]>([initialDocLine]);
	const [searchCardName, setSearchCardName] = useState<string>("");
	const [searchItemName, setSearchItemName] = useState<string>("");
	const [bpModalOpen, setBpModalOpen] = useState<boolean>(false);

	const { data: bpData = [] } = useGet<BpTypes[]>(
		["businessPartners", "businesspartners", searchCardName],
		generateUrlWithParams("businesspartners", {
			cardName: String(searchCardName),
			cardType: "C",
		})
	);

	const { data: whsData = [] } = useGet<WhsTypes[]>(
		["whs", "warehouses"],
		generateUrlWithParams("warehouses", {})
	);

	const { data: itemsData = [] } = useGet<ItemTypes[]>(
		["items", "items/items", searchItemName, 100000, 0],
		generateUrlWithParams("items/items", {
			itemName: String(searchItemName),
			pageSize: 100000,
			skip: 0,
		})
	);

	const { data: docRateFromApi = [] } = useGet<string | number>(
		["docRate", "currencies/get-currency-rate", searchItemName],
		generateUrlWithParams("currencies/get-currency-rate", {}),
		false
	);

	useEffect(() => {
		if (isOpen) {
			setData((prev) => ({ ...prev, docRate: (docRateFromApi as number) || 0 }));
		}
	}, [isOpen]);

	const optionsItemName = itemsData.map((item) => ({
		value: item.itemCode,
		label: item.itemName,
		data: item,
	}));

	const bpOptions = bpData.map((bp) => ({
		value: bp.cardCode,
		label: bp.cardName,
	}));

	const whsOptions = whsData.map((whs) => ({
		value: whs.warehouseCode,
		label: whs.warehouseName,
	}));

	const currency = [
		{ value: "SUM", label: "SUM" },
		{ value: "EUR", label: "Euro" },
		{ value: "USD", label: "Dollar" },
	];

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

	const handleSearchItem = (value: string, index: number) => {
		debouncedSet(setSearchItemName, value);
		const updatedDocLines = [...docLines];
		if (value === "") {
			updatedDocLines[index].itemCode = "";
		}
		updatedDocLines[index].itemName = value;
		setDocLines(updatedDocLines);
	};

	const handleSelectItem = (value: string | number, label: any, index: number) => {
		const data = label.data;
		setSearchItemName("");
		const updatedDocLines = [...docLines];
		updatedDocLines[index].itemCode = value as string;
		updatedDocLines[index].itemName = label.label;
		updatedDocLines[index].price = data.price;
		setDocLines(updatedDocLines);
	};

	const postSalesInvoice = () => {
		const documentLines = docLines.map((line, index) => {
			return {
				lineNum: index,
				itemCode: line.itemCode,
				unitPrice: +line.price,
				quantity: +line.quantity,
				currency: data.currency,
				warehouseCode: data?.whsCode,
				baseType: -1,
				baseEntry: null,
				baseLine: null,
			};
		});

		const body = {
			cardCode: data.cardCode,
			docCurrency: data.currency,
			docDate: data.docDate,
			docDueDate: data.docDueDate,
			salesPersonCode: data.slpCode,
			comments: data.comments,
			docRate: data.currency === "USD" ? 1 : data.docRate,
			documentLines,
		};
		sendRequest({
			url: "/sales/invoices",
			data: body,
			method: "POST",
			successMessage: t("success"),
			errorMessage: t("error"),
			showSuccessModal: true,
			showErrorModal: true,
			additionalFn: onCloseModal,
		});
	};

	const columns: ColumnsTypes[] = [
		{
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
		},
		{
			title: t("itemName"),
			dataIndex: "itemName",
			key: "itemName",
			width: 400,
			render: (text, record, index) => {
				return (
					<AutoComplete
						className="w-[350px]"
						placeholder="Search items..."
						options={optionsItemName}
						onSearch={(value) => {
							handleSearchItem(value, index);
						}}
						onSelect={(value, label) => {
							handleSelectItem(value, label, index);
						}}
						value={record.itemName}
					/>
				);
			},
		},
		{
			title: t("quantity"),
			dataIndex: "quantity",
			key: "quantity",
			width: 150,
			render: (text, record, index) => {
				return (
					<Input
						type="text"
						value={formatNumber(text) as string}
						className="!min-w-24"
						onChange={(e) => {
							const updatedDocLines = [...docLines];
							updatedDocLines[index].quantity = removeSpaces(e.target.value);

							setDocLines(updatedDocLines);
						}}
					/>
				);
			},
		},

		{
			title: t("price"),
			dataIndex: "price",
			key: "price",
			width: 120,
			render: (text, record, index) => {
				return (
					<Input
						type="text"
						value={formatNumber(text) as string}
						className="!min-w-24"
						onChange={(e) => {
							const updatedDocLines = [...docLines];
							updatedDocLines[index].price = removeSpaces(e.target.value);
							setDocLines(updatedDocLines);
						}}
					/>
				);
			},
		},
	];

	const onCloseModal = () => {
		resetState();
		onClose();
	};

	const resetState = () => {
		setData(initialData);
		setDocLines([initialDocLine]);
		setSearchCardName("");
		setSearchItemName("");
	};

	const postData = () => {
		postSalesInvoice();
	};

	return (
		<Modal
			centered
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onClose}
			onCancel={onClose}
			footer={null}
			width={"90%"}
			// title={<h1 className="font-nunito text-xl font-extrabold text-[#000000]">{t("addSales")}</h1>}
		>
			<div>
				<div className="flex flex-wrap gap-5 mb-5 bg-gra">
					<div className="flex 	flex-col gap-2">
						<span>{t("cardName")}</span>
						<div className="flex items-center gap-2">
							<AutoComplete
								options={bpOptions}
								className="w-[250px]"
								onSearch={(value) => {
									debouncedSet(setSearchCardName, value);
									setData({ ...data, cardName: value });
									if (value === "") {
										setData({ ...data, cardCode: "", cardName: "" });
									}
								}}
								value={data?.cardName}
								onSelect={(value, label) => {
									setSearchCardName("");
									setData({ ...data, cardName: label.label as string, cardCode: value });
								}}
							/>
							<Button
								className="bg-secondary hover:!bg-secondary-hover text-white hover:!text-white"
								hasShadow={false}
								onClick={() => {
									setBpModalOpen(true);
								}}
							>
								+
							</Button>
						</div>
					</div>

					<div className="flex 	flex-col gap-2">
						<span>{t("docDate")}</span>
						<Input
							type="date"
							placeholder={t("docDate")}
							onChange={(e) => setData({ ...data, docDate: e.target.value })}
							value={data?.docDate || ""}
							allowClear
						/>
					</div>

					<div className="flex 	flex-col gap-2">
						<span>{t("currency")}</span>
						<Select
							className="w-[150px]"
							options={currency}
							onChange={(e) => setData({ ...data, currency: e })}
							value={data?.currency || ""}
							placeholder={t("currency")}
						/>
					</div>

					<div className="flex 	flex-col gap-2">
						<span>{t("whs")}</span>
						<Select
							className="min-w-[250px]"
							options={whsOptions}
							onChange={(e) => setData({ ...data, whsCode: e })}
							value={data?.whsCode || ""}
							placeholder={t("whs")}
						/>
					</div>

					{/*
					<div className="flex 	flex-col gap-2">
						<span>{t("slpName")}</span>
						<Select
							className="w-[150px]"
							options={slpOptions}
							onChange={(e) => setData({ ...data, slpCode: e })}
							value={data?.slpCode || ""}
							placeholder={t("slpName")}
							disabled
						/>
					</div> */}
				</div>
				<div className="">
					<Table columns={columns} data={docLines} />
				</div>

				<div className="flex items-center justify-end mt-5">
					<div className="flex flex-col gap-2">
						<span>{t("comments")}</span>
						<TextArea
							rows={4}
							className="w-[300px]"
							value={data.comments}
							onChange={(e) => {
								setData({ ...data, comments: e.target.value });
							}}
						/>
					</div>
				</div>

				<div className="flex items-center gap-10 mt-10 justify-end">
					<Button
						onClick={() => {
							onClose();
						}}
						hasShadow={false}
						className="w-[200px] bg-red-600 h-[35px] rounded-lg text-white hover:!bg-red-500 hover:!text-white"
					>
						{t("back")}
					</Button>
					<Button
						onClick={postData}
						loading={isSending}
						disabled={
							isSending ||
							!data.cardCode ||
							!data.docDate ||
							!data.docRate ||
							!data.currency ||
							!data.slpCode ||
							docLines.some((item) => !item.itemCode) ||
							docLines.some((item) => !item.whsCode)
						}
						hasShadow={false}
						className="w-[200px] bg-[#0A4D68] h-[35px] rounded-lg text-white hover:!text-white hover:!bg-secondary-hover"
					>
						{t("add")}
					</Button>
				</div>
			</div>
			<AddBp isOpen={bpModalOpen} onClose={() => setBpModalOpen(false)} />
		</Modal>
	);
};

export default memo(AddSales);
