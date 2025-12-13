import { useState } from "react";
import { Modal } from "antd";
import type { AddModalType } from "../../BussinessPartners/Create/types";
import Table from "@/components/ui/Table";
import { useLanguage } from "@/hooks/useLanguage";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import Input from "@/components/ui/Input";
import formatNumber, { formatNumberInput, removeSpaces } from "@/helpers/formatNumber";
import Button from "@/components/ui/Button";
import moment from "moment";
import { useGet } from "@/hooks/useGet";
import type { ItemTypes, WhsTypes } from "@/types/api/index";
import { generateUrlWithParams } from "@/lib/helpers";
import AutoComplete from "@/components/ui/AutoComplete";
import { debouncedSet } from "@/helpers/debounce";
import useSendRequest from "@/hooks/useSubmitData";
import type { InventoryTRLinesTypes } from "@/types/api/StockTransfers";
import SimpleButton from "@/components/ui/SimpleButton";
import Select from "@/components/ui/Select";
import { getCookie } from "@/lib/actions";
import ViewItemsOnHand from "../../Sales/ViewOnHandItem";
import { Eye } from "lucide-react";
import api from "@/api/axiosInstance";

export default function AddStocks({ isOpen, onClose }: AddModalType) {
	const { t } = useLanguage("tab.stocks");
	const { isSending, sendRequest } = useSendRequest();
	const getMe = getCookie("get_me");

	const initialDocLine: InventoryTRLinesTypes = {
		fromWarehouseCode: getMe?.wareHouse,
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

	const [docLines, setDocLines] = useState<InventoryTRLinesTypes[]>([initialDocLine]);
	const [searchItemName, setSearchItemName] = useState<string>("");
	const [fromWhs, setFromWhs] = useState<string>(getMe?.wareHouse as string);
	const [toWhs, setToWhs] = useState<string>("");
	const [docDate, setDocDate] = useState<string>(moment().format("YYYY-MM-DD"));
	const [viewOnHandItemsModalOpen, setViewOnHandItemsModalOpen] = useState<boolean>(false);
	const [selectedRowData, setSelectedRowData] = useState<InventoryTRLinesTypes>(null);

	const { data: itemsData = [] } = useGet<ItemTypes[]>(
		["slp", "items/items", searchItemName, 100000, 0],
		generateUrlWithParams("items/items", {
			itemName: String(searchItemName),
			pageSize: 100000,
			skip: 0,
		})
	);

	const { data: whsData = [] } = useGet<WhsTypes[]>(
		["slp", "warehouses"],
		generateUrlWithParams("warehouses", {})
	);

	const optionsItemName = itemsData
		?.filter((item) => docLines.every((line) => line.itemCode !== item.itemCode))
		.map((item) => ({
			value: item.itemCode,
			label: item.itemName,
			data: item,
		}));

	const whsOptions = whsData.map((whs) => ({
		value: whs.warehouseCode,
		label: whs.warehouseName,
	}));

	const columns: ColumnsTypes[] = [
		{
			title: t("itemName"),
			dataIndex: "itemDescription",
			key: "itemDescription",
			render: (text, record, index) => (
				<AutoComplete
					className="w-full"
					placeholder="Search items..."
					options={optionsItemName}
					onSearch={(value) => {
						handleSearchItem(value, index);
					}}
					onSelect={(value, label) => {
						handleSelectItem(value, label, index);
					}}
					disabled={!fromWhs}
					value={record.itemDescription}
				/>
			),
		},
		{
			title: t("quantity"),
			dataIndex: "quantity",
			key: "quantity",
			// width: 120,
			render: (text, record, index) => (
				<Input
					type="text"
					value={formatNumberInput(text) as string}
					className="!min-w-24"
					onChange={(e) => {
						const updatedDocLines = [...docLines];
						updatedDocLines[index].quantity = removeSpaces(e.target.value);
						setDocLines(updatedDocLines);
					}}
					disabled={!fromWhs}
				/>
			),
		},
		{ title: t("onHand"), dataIndex: "onHand", key: "onHand", type: "number" },
		{ title: t("ugpName"), dataIndex: "uoMName", key: "uoMName" },
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
							disabled={!fromWhs}
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
						{/* <Button
							className="bg-primary  text-white hover:!bg-red-400 hover:!text-white"
							hasShadow={false}
							onClick={() => {
								handleRowClick(record);
							}}
							disabled={!record.itemCode}
						>
							<Eye />
						</Button> */}
					</div>
				);
			},
		},
	];

	const handleRowClick = (record: InventoryTRLinesTypes) => {
		setSelectedRowData(record);
		setViewOnHandItemsModalOpen(true);
	};

	const getItemsOnHand = async (itemCode: string, index: number, whs: string) => {
		try {
			const { data } = await api.get(`/items/onhand-items?itemCodes=${itemCode}&warehouse=${whs}`);
			const updatedDocLines = [...docLines];
			updatedDocLines[index].onHand = data?.data[0]?.onHand;
			setDocLines(updatedDocLines);
			console.log(updatedDocLines, data);
		} catch (error) {
			console.log(error);
		}
	};

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
		getItemsOnHand(value as string, index, fromWhs as string);
		setSearchItemName("");
		const updatedDocLines = [...docLines];
		updatedDocLines[index].itemCode = value as string;
		updatedDocLines[index].itemDescription = label.label;
		updatedDocLines[index].uoMCode = label.data.uomEntry;
		updatedDocLines[index].uoMName = label.data.uomName;
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

	const postData = () => {
		const stockTransferLines = docLines.map((docLine, index) => {
			return {
				lineNum: index,
				itemCode: docLine.itemCode,
				quantity: +removeSpaces(docLine.quantity),
				warehouseCode: toWhs,
				fromWarehouseCode: fromWhs,
				baseType: -1,
				baseEntry: null,
				baseLine: null,
			};
		});
		const body = {
			docDate,
			dueDate: docDate,
			toWarehouse: toWhs,
			stockTransferLines: stockTransferLines,
		};

		sendRequest({
			url: `stocktransfers`,
			data: body,
			method: "POST",
			successMessage: t("successCreated"),
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
		setDocLines([initialDocLine]);
		setSearchItemName("");
		setToWhs("");
		setDocDate(moment().format("YYYY-MM-DD"));
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
		>
			<div className="mt-5">
				<div className="flex flex-wrap gap-5 mb-5">
					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("fromWhs")}</span>
						<Select
							className="w-[200px]"
							value={fromWhs}
							onChange={setFromWhs}
							options={whsOptions.filter((whs) => whs.value !== toWhs && whs.value !== "Tam")}
							allowClear
							disabled={docLines?.some((docLine) => docLine.itemCode)}
						/>
					</div>
					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("toWhs")}</span>
						<Select
							className="w-[200px]"
							value={toWhs}
							options={whsOptions.filter((whs) => whs.value !== fromWhs && whs.value !== "Tam")}
							onChange={setToWhs}
							allowClear
						/>
					</div>

					<div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("docDate")}</span>
						<Input
							value={moment(docDate).format("YYYY-MM-DD")}
							type="date"
							onChange={(e) => {
								setDocDate(e.target.value);
							}}
						/>
					</div>
				</div>
				<div className="mt-5">
					<Table columns={columns} data={docLines} />
				</div>

				<div className="flex justify-end gap-5 mt-5">
					<Button
						className="bg-primary text-white hover:!bg-primary/70 hover:!text-white"
						hasShadow={false}
						onClick={onCloseModal}
						loading={isSending}
					>
						{t("back")}
					</Button>

					<Button
						className="bg-secondary text-white hover:!bg-secondary/70 hover:!text-white"
						hasShadow={false}
						onClick={postData}
						loading={isSending}
					>
						{t("add")}
					</Button>
				</div>
				<ViewItemsOnHand
					isOpen={viewOnHandItemsModalOpen}
					data={selectedRowData}
					onClose={() => setViewOnHandItemsModalOpen(false)}
				/>
			</div>
		</Modal>
	);
}
