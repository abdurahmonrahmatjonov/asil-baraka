import { memo, useState } from "react";

import { Modal } from "antd";
import Select from "@/components/ui/Select";
import AutoComplete from "@/components/ui/AutoComplete";
import Table from "@components/ui/Table";
import Button from "@/components/ui/Button";
import SimpleButton from "@/components/ui/SimpleButton";
import { useLanguage } from "@/hooks/useLanguage";
import { useGet } from "@/hooks/useGet";
import useSendRequest from "@/hooks/useSubmitData";
import { debouncedSet } from "@/helpers/debounce";
import { generateUrlWithParams } from "@/lib/helpers";
import { getCookie } from "@/lib/actions";

import type { ItemTypes, WhsTypes } from "@/types/api/index";
import type { AddModalType } from "../../BussinessPartners/Create/types";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import type { InventoryLinesTypes, InventoryResDataTypes } from "@/types/api/Inventory";
import type { GetMeTypes } from "@/types/api/Auth";

const AddInventory = ({ isOpen, onClose }: AddModalType) => {
	const getMe: GetMeTypes = getCookie("get_me");

	const initialDocLine: InventoryLinesTypes = {
		itemCode: "",
		itemName: "",
		itemDescription: "",
	};

	const initialData: InventoryResDataTypes = {
		whsCode: getMe?.wareHouse || "",
		whsName: "",
	};

	const { t } = useLanguage("tab.sales");
	const { isSending, sendRequest } = useSendRequest();

	const [data, setData] = useState<InventoryResDataTypes>(initialData);
	const [docLines, setDocLines] = useState<InventoryLinesTypes[]>([initialDocLine]);
	const [searchItemName, setSearchItemName] = useState<string>("");

	const { data: whsData = [] } = useGet<WhsTypes[]>(
		["whs", "warehouses"],
		generateUrlWithParams("warehouses", {})
	);

	const { data: itemsData = [] } = useGet<ItemTypes[]>(
		["items", "items/inventory-items", searchItemName, 100000, 0],
		generateUrlWithParams("items/inventory-items", {
			itemName: String(searchItemName),
			pageSize: 100000,
			skip: 0,
			warehouseCode: getMe?.wareHouse || "",
		})
	);

	const optionsItemName = itemsData.map((item) => ({
		value: item.itemCode,
		label: item.itemName,
		data: item,
	}));

	const whsOptions = whsData.map((whs) => ({
		value: whs.warehouseCode,
		label: whs.warehouseName,
	}));

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
		console.log("label", label);
		setSearchItemName("");
		const updatedDocLines = [...docLines];
		updatedDocLines[index].itemCode = value as string;
		updatedDocLines[index].itemName = label.label;
		setDocLines(updatedDocLines);
	};

	const postData = () => {
		const inventoryCountingLines = docLines.map((line) => {
			return {
				itemCode: line.itemCode,
				warehouseCode: data.whsCode,
			};
		});

		const body = {
			singleCounterID: getMe?.employeeId,
			inventoryCountingLines,
		};
		sendRequest({
			url: "/inventorycountings",
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

		// {
		// 	title: t("whs"),
		// 	dataIndex: "whsCode",
		// 	key: "whsCode",
		// 	width: 220,
		// 	render: (text, record, index) => {
		// 		return (
		// 			<Select
		// 				options={whsOptions}
		// 				className="w-[200px]"
		// 				value={text}
		// 				onChange={(value, label) => handleSelectWhs(value, label, index, record)}
		// 			/>
		// 		);
		// 	},
		// },
	];

	const onCloseModal = () => {
		resetState();
		onClose();
	};

	const resetState = () => {
		setData(initialData);
		setDocLines([initialDocLine]);
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
			width={"50%"}
			// title={<h1 className="font-nunito text-xl font-extrabold text-[#000000]">{t("addSales")}</h1>}
		>
			<div>
				<div className="flex flex-col  gap-1">
					<span className="font-semibold">{t("whs")}</span>
					<Select
						options={whsOptions}
						className="w-[200px]"
						value={data.whsCode}
						onChange={(value, label) => {
							setData({ ...data, whsCode: value as string });
						}}
						disabled
					/>
				</div>

				<div className="mt-5">
					<Table columns={columns} data={docLines} />
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
						disabled={isSending || docLines.some((item) => !item.itemCode)}
						hasShadow={false}
						className="w-[200px] bg-[#0A4D68] h-[35px] rounded-lg text-white hover:!text-white hover:!bg-secondary-hover"
					>
						{t("add")}
					</Button>
				</div>
				{/* <AlertModal type={"success"} isOpen={isOpen} onClose={onClose} /> */}
			</div>
		</Modal>
	);
};

export default memo(AddInventory);
