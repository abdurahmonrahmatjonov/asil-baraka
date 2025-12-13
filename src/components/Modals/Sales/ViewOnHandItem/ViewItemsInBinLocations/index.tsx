import { useState, useEffect } from "react";
import { Modal } from "antd";
import Table from "@/components/ui/Table";
import { useLanguage } from "@/hooks/useLanguage";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import type { ViewModalType } from "@components/Modals/types";

export default function ViewItemsInBinLocations({ isOpen, onClose, data }: ViewModalType) {
	const { t } = useLanguage("tab.sales");

	if (!data) {
		return null;
	}

	const columns: ColumnsTypes[] = [
		{
			title: t("binLocation"),
			dataIndex: "binCode",
			key: "binCode",
		},
		{
			title: t("quantityInStock"),
			dataIndex: "onHandQuantity",
			key: "onHandQuantity",
			render: (text, record, index) => <span>{text}</span>,
			type: "number",
		},
	];

	console.log("Bin Data = ", data);

	return (
		<Modal
			centered
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onClose}
			onCancel={onClose}
			footer={null}
			width={"50%"}
			title={
				<h1 className="font-nunito text-xl font-extrabold text-[#000000]">
					{t("whsName")} : {data?.warehouseName}
				</h1>
			}
		>
			<div className="mt-5">
				<div className="mt-5">
					<Table columns={columns} data={data.binLocations} />
				</div>
			</div>
		</Modal>
	);
}
