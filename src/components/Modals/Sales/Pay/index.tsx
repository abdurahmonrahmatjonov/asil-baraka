import { useEffect, useState } from "react";
import { Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import type { ViewModalType } from "../../BussinessPartners/Create/types";
import { useLanguage } from "@/hooks/useLanguage";
import Input from "@/components/ui/Input";
import formatNumber, { removeSpaces } from "@/helpers/formatNumber";
import Button from "@/components/ui/Button";
import useSendRequest from "@/hooks/useSubmitData";
import Select from "@/components/ui/Select";
import moment from "moment";
import { generateUrlWithParams } from "@/lib/helpers";
import { useGet } from "@/hooks/useGet";
import { getCookie } from "@/lib/actions";
import type { CashAccTypes } from "@/types/api/index";

interface DataType {
	docDate: string;
	docRate: string | number;
	comments: string;
	cardCode: string;
	usdAmount: string;
	usdCash: string;
	uzsAmount: string;
	uzsCash: string;
	terminalAmount: string;
	terminalCash: string;
	clickAmount: string;
	clickCashAcc: string;
	totalAmount: string;
}

export default function PaySales({ isOpen, onClose, data: salesData }: ViewModalType) {
	const { t } = useLanguage("tab.sales");
	const { isSending, sendRequest } = useSendRequest();
	const getMe = getCookie("get_me");
	const initialData: DataType = {
		docDate: moment().format("YYYY-MM-DD"),
		cardCode: salesData?.cardCode,
		comments: "",
		usdAmount: "",
		usdCash: getMe?.u_CashAccount,
		uzsAmount: "",
		uzsCash: getMe?.u_CashAccountUZS,
		docRate: "",
		terminalAmount: "",
		terminalCash: "",
		clickAmount: "",
		clickCashAcc: getMe?.u_CardAccount,
		totalAmount: "",
	};
	console.log("getMe", getMe);
	console.log("initialData", initialData);

	const [data, setData] = useState<DataType>(initialData);

	const { data: docRateFromApi = [] } = useGet<string | number>(
		["docRate", "currencies/get-currency-rate"],
		generateUrlWithParams("currencies/get-currency-rate", {}),
		false
	);

	useEffect(() => {
		if (docRateFromApi) {
			setData({ ...data, docRate: docRateFromApi as string });
		}
	}, [isOpen]);
	const totalAmount =
		+removeSpaces(data.uzsAmount) +
		+removeSpaces(data.usdAmount) * +removeSpaces(data.docRate) +
		+removeSpaces(data.terminalAmount) +
		+removeSpaces(data.clickAmount);

	const { data: cashAccData = [] } = useGet<CashAccTypes[]>(
		["cashAcc", "cashaccounts"],
		generateUrlWithParams("cashaccounts", {})
	);

	const cashAccOptions = cashAccData?.map((item) => {
		return {
			value: item.acctCode,
			label: `${item.acctCode} - ${item.acctName}`,
		};
	});

	if (!salesData) {
		return null;
	}

	const postData = async () => {
		const payments = (cashAcc: string, amount: string | number, currency: string) => {
			return {
				currency: currency,
				account: cashAcc,
				cashSum: +removeSpaces(amount),
			};
		};

		const paymentInvoices = [];

		if (data.usdAmount) {
			paymentInvoices.push(payments(data.usdCash, data.usdAmount, "USD"));
		}
		if (data.uzsAmount) {
			paymentInvoices.push(payments(data.uzsCash, data.uzsAmount, "UZS"));
		}
		if (data.terminalAmount) {
			paymentInvoices.push(payments(data.terminalCash, data.terminalAmount, "UZS"));
		}
		if (data.clickAmount) {
			paymentInvoices.push(payments(data.clickCashAcc, data.clickAmount, "UZS"));
		}

		const body = {
			cardCode: salesData?.cardCode,
			docDate: moment(data?.docDate).format("YYYY-MM-DD"),
			docEntry: salesData?.docEntry,
			docRate: removeSpaces(data?.docRate),
			payments: paymentInvoices,
		};

		sendRequest({
			url: "/payments/incoming-payment/batch",
			method: "POST",
			data: body,
			successMessage: t("success"),
			errorMessage: t("error"),
			showSuccessModal: true,
			showErrorModal: true,
			additionalFn: resetForm,
		});
	};

	const resetForm = () => {
		onClose();
		setData(initialData);
	};

	return (
		<Modal
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onClose}
			onCancel={onClose}
			footer={null}
			width={"50%"}
			title={
				<h1 className="font-nunito text-xl font-extrabold text-[#000000]">
					{t("docNum")} : {salesData?.docNum}
				</h1>
			}
		>
			<div className="w-full px-5">
				<div className="flex items-center justify-between mt-5">
					<div className="flex flex-col gap-2">
						<span className="font-bold">{t("docRate")}</span>
						<Input
							type="text"
							value={formatNumber(data?.docRate) as string}
							className=" h-9 w-auto "
							onChange={(e) => {
								setData({ ...data, docRate: e.target.value });
							}}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<span className="font-bold">{t("docDate")}</span>
						<Input
							type="date"
							value={data?.docDate}
							className=" h-9 w-auto "
							onChange={(e) => {
								setData({ ...data, docDate: e.target.value });
							}}
						/>
					</div>
				</div>

				{/* USD  */}
				<div className="flex items-center gap-5  mt-5">
					<div className="flex flex-col gap-2 w-full">
						<span className="font-bold">{t("USD")}</span>
						<Input
							type="text"
							value={formatNumber(data?.usdAmount) as string}
							className=" h-9 w-full "
							onChange={(e) => {
								setData({ ...data, usdAmount: e.target.value });
							}}
						/>
					</div>
					<div className=" flex flex-col  gap-2  ">
						<span className="font-bold">{t("cashAcc")}</span>
						<Select
							onChange={(val) => {
								setData({ ...data, usdCash: val });
							}}
							options={cashAccOptions}
							value={data.usdCash}
							className="flex h-9 w-[300px] items-center justify-center"
							disabled
						/>
					</div>
				</div>

				{/* UZS */}
				<div className="flex items-center gap-5  mt-5">
					<div className="flex flex-col gap-2 w-full">
						<span className="font-bold">{t("uzsCash")}</span>
						<Input
							type="text"
							value={formatNumber(data?.uzsAmount) as string}
							className=" h-9 w-full "
							onChange={(e) => {
								setData({ ...data, uzsAmount: e.target.value });
							}}
						/>
					</div>

					<div className=" flex flex-col  gap-2  ">
						<span className="font-bold">{t("cashAcc")}</span>
						<Select
							onChange={(val) => {
								setData({ ...data, uzsCash: val });
							}}
							options={cashAccOptions}
							value={data.uzsCash}
							className="flex h-9 w-[300px] items-center justify-center"
							disabled
						/>
					</div>
				</div>

				{/*Click | Payme  */}
				<div className="flex items-center gap-5  mt-5">
					<div className="flex flex-col gap-2 w-full">
						<span className="font-bold">{t("clickCard")}</span>
						<Input
							type="text"
							value={formatNumber(data?.clickAmount) as string}
							className=" h-9 w-full "
							onChange={(e) => {
								setData({ ...data, clickAmount: e.target.value });
							}}
						/>
					</div>

					<div className=" flex flex-col  gap-2 ">
						<span className="font-bold">{t("cashAcc")}</span>
						<Select
							onChange={(val) => {
								setData({ ...data, clickCashAcc: val });
							}}
							options={cashAccOptions}
							value={data.clickCashAcc}
							className="flex h-9 w-[300px] items-center justify-center"
							disabled
						/>
					</div>
				</div>

				{/* Terminal */}
				{/* <div className="flex items-center gap-5  mt-5">
					<div className="flex flex-col gap-2 w-full">
						<span className="font-bold">{t("terminal")}</span>
						<Input
							type="text"
							value={formatNumber(data?.terminalAmount)}
							className=" h-9 w-full "
							onChange={(e) => {
								setData({ ...data, terminalAmount: e.target.value });
							}}
						/>
					</div>

					<div className=" flex flex-col  gap-2  ">
						<span className="font-bold">{t("cashAcc")}</span>
						<Select
							onChange={(val) => {
								setData({ ...data, terminalCash: val });
							}}
							value={data.terminalCash}
							className="flex h-9 w-[300px] items-center justify-center"
							disabled
						/>
					</div>
				</div> */}

				<div className="flex flex-col gap-2 mt-5 ">
					<span className="font-bold ">{t("totalAmount")}</span>
					<Input
						type="text"
						value={formatNumber(totalAmount) as string}
						className=" h-9 w-[200px] "
						suffix={"UZS"}
						disabled
					/>
				</div>

				<div className="flex flex-col items-start gap-2 w-full mt-5">
					<span className="font-bold">{t("comments")}</span>
					<TextArea
						onChange={(e) => {
							setData({ ...data, comments: e.target.value });
						}}
						value={data.comments}
						className="w-full"
						rows={4}
					/>
				</div>

				<div className="flex items-center gap-10 mt-14 justify-between">
					<Button
						onClick={() => {
							resetForm();
						}}
						hasShadow={false}
						className="w-full bg-red-600 h-[35px] rounded-lg text-white hover:!bg-red-500 hover:!text-white"
					>
						{t("back")}
					</Button>
					<Button
						onClick={postData}
						loading={isSending}
						disabled={isSending}
						hasShadow={false}
						className="w-full bg-[#0A4D68] h-[35px] rounded-lg text-white hover:!text-white hover:!bg-secondary-hover"
					>
						{t("pay")}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
