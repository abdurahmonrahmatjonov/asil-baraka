import { useState, useEffect } from "react";
import { Modal } from "antd";
import Table from "@/components/ui/Table";
import { useLanguage } from "@/hooks/useLanguage";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import type { ViewModalType } from "@components/Modals/types";
import api from "@/api/axiosInstance";

export default function ViewItemsOnHand({ isOpen, onClose, data }: ViewModalType) {
	const { t } = useLanguage("tab.sales");
	const [itemCode, setItemCode] = useState("");
	const [resData, setResData] = useState<any>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (data?.itemCode) {
			setItemCode(data?.itemCode);
		}
	}, [data, isOpen]);

	useEffect(() => {
		if (itemCode && isOpen) {
			getItemsOnHand(itemCode);
		}
	}, [itemCode]);

	const getItemsOnHand = async (itemCode: string) => {
		setLoading(true);
		try {
			const { data } = await api.get(`/items/onhand-items?itemCodes=${itemCode}`);
			setResData(data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	if (!data) {
		return null;
	}

	const columns: ColumnsTypes[] = [
		{
			title: t("whsName"),
			dataIndex: "whsName",
			key: "whsName",
		},

		{
			title: t("onHand"),
			dataIndex: "onHand",
			key: "onHand",
			type: "number",
		},
	];

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
					{t("itemName")} : {data?.itemName}
				</h1>
			}
		>
			<div className="mt-5">
				<div className="mt-5">
					<Table columns={columns} data={resData} loading={loading} />
				</div>
			</div>
		</Modal>
	);
}
