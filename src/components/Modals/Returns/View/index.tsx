import React, { useState, useEffect } from "react";

import { Modal } from "antd";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLanguage } from "@/hooks/useLanguage";
import formatNumber from "@/helpers/formatNumber";
import useSendRequest from "@/hooks/useSubmitData";

import type { ViewModalType } from "../../BussinessPartners/Create/types";
import type { DocumentLinesType } from "@/types/api/Returns";
import type { ColumnsTypes } from "@/components/ui/Table/types";

export default function ViewReturns({ isOpen, onClose, data, isShowAddBtn }: ViewModalType) {
	const { t } = useLanguage("tab.return");

	const { isSending, sendRequest } = useSendRequest();

	const [docLines, setDocLines] = useState<DocumentLinesType[]>([]);
	const [isChange, setIsChange] = useState(false);

	useEffect(() => {
		if (data?.documentLines) {
			setDocLines(data.documentLines || []);
		}
	}, [data]);

	if (!data) {
		return null;
	}

	const columns: ColumnsTypes[] = [
		{
			title: t("itemName"),
			dataIndex: "itemDescription",
			key: "itemDescription",
		},
		{
			title: t("quantity"),
			dataIndex: "quantity",
			key: "quantity",
			type: "number",
		},
		// {
		// 	title: t("price"),
		// 	dataIndex: "price",
		// 	key: "price",
		// 	type: "number",
		// 	render: (text, record: DocumentLinesType) => (
		// 		<span>{`${formatNumber(text)} ${record.currency}`}</span>
		// 	),
		// },
		{ title: t("whsName"), dataIndex: "whsName", key: "whsName" },

		// {
		// 	title: t("lineTotal"),
		// 	dataIndex: "lineTotal",
		// 	key: "lineTotal",
		// 	render: (text, record: DocumentLinesType) => (
		// 		<span>{`${formatNumber(+record.quantity * +record.price)} ${record.currency}`}</span>
		// 	),
		// },
	];

	const handleAddToReturnHistory = () => {
		sendRequest({
			url: `sales/credit-notes/save-draft/${data.docEntry}`,
			data: {},
			method: "POST",
			successMessage: t("successAdded"),
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

	return (
		<Modal
			centered
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onCloseModal}
			onCancel={onCloseModal}
			footer={null}
			width={"80%"}
			zIndex={100}
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

					{/* <div className="flex flex-col  gap-1">
						<span className="font-semibold">{t("docTotal")}</span>
						<Input value={`${formatNumber(data?.docTotal)} ${data?.docCurrency}`} disabled />
					</div> */}
				</div>
				<div className="mt-5">
					<Table columns={columns} data={docLines} />
				</div>

				<div className="flex justify-end gap-5 mt-5">
					{isShowAddBtn && (
						<Button
							className="bg-secondary text-white hover:!bg-secondary/70 hover:!text-white"
							hasShadow={false}
							onClick={handleAddToReturnHistory}
							loading={isSending}
							disabled={isChange}
						>
							{t("create")}
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
}
