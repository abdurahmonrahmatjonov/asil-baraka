import { useState, useEffect } from "react";
import { Modal } from "antd";
import type { ViewModalType } from "../../BussinessPartners/Create/types";
import Table from "@/components/ui/Table";
import { useLanguage } from "@/hooks/useLanguage";
import type { ColumnsTypes } from "@/components/ui/Table/types";
import moment from "moment";
import api from "@/api/axiosInstance";
import type { AktSverkaResTypes } from "./types";
import Input from "@/components/ui/Input";
import formatNumber from "@/helpers/formatNumber";

export default function ViewAktSverka({ isOpen, onClose, data: viewData }: ViewModalType) {
	const { t } = useLanguage("tab.akt_sverka");

	const [cardCode, setCardCode] = useState("");
	const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
	const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
	const [data, setData] = useState<AktSverkaResTypes>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (viewData?.cardCode) {
			setCardCode(viewData.cardCode);
		}
	}, [viewData, isOpen]);

	useEffect(() => {
		if (cardCode && isOpen) {
			getAktSverka(cardCode, startDate, endDate);
		}
	}, [cardCode, startDate, endDate]);

	const getAktSverka = async (cardCode: string, startDate: string, endDate: string) => {
		setLoading(true);
		try {
			const { data } = await api.get(
				`/businesspartners/info?cardCode=${cardCode}&startDate=${startDate}&endDate=${endDate}`
			);
			setData(data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	if (!viewData) {
		return null;
	}

	const onCloseModal = () => {
		setCardCode("");
		setStartDate(moment().startOf("month").format("YYYY-MM-DD"));
		setEndDate(moment().format("YYYY-MM-DD"));
		onClose();
	};

	const columns: ColumnsTypes[] = [
		{ title: t("docDate"), dataIndex: "dueDate", key: "dueDate" },
		{ title: t("docNum"), dataIndex: "docNum", key: "docNum" },
		{ title: t("debit"), dataIndex: "debit", key: "debit", type: "number" },
		{
			title: t("credit"),
			dataIndex: "credit",
			key: "credit",
			type: "number",
		},
		{
			title: t("cumulativeBalance"),
			dataIndex: "cumulativeBalance",
			key: "cumulativeBalance",
			type: "number",
		},
		{ title: t("lineMemo"), dataIndex: "lineMemo", key: "lineMemo" },
	];

	return (
		<Modal
			centered
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onCloseModal}
			onCancel={onCloseModal}
			footer={null}
			width={"80%"}
		>
			<div className="mt-5">
				<div className="flex flex-col gap-5">
					<div className="flex items-center justify-between gap-5">
						<div className="flex flex-col  gap-2">
							<span className="font-semibold">{t("cardName")}</span>
							<Input className="w-[200px]" value={data?.cardName} disabled />
						</div>
						<div className="flex gap-5">
							<div className="flex flex-col  gap-2">
								<span className="font-semibold">{t("startDate")}</span>
								<Input
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
								/>
							</div>
							<div className="flex flex-col  gap-2">
								<span className="font-semibold">{t("endDate")}</span>
								<Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
							</div>
						</div>
					</div>
					<div className="flex items-center justify-between gap-5">
						<div className="flex flex-col  gap-2">
							<span className="font-semibold">{t("debtNow")}</span>
							<Input className="w-[200px]" value={formatNumber(data?.balance) as string} disabled />
						</div>

						<div className="flex flex-col  gap-2">
							<span className="font-semibold">{t("debtInStart")}</span>
							<Input
								className="w-[200px]"
								value={formatNumber(data?.balanceFirstDayOfPeriod) as string}
								disabled
							/>
						</div>
					</div>
				</div>

				<div className="mt-5">
					<Table columns={columns} loading={loading} data={data?.businessPartnerInfoLines} />
				</div>
			</div>
		</Modal>
	);
}
