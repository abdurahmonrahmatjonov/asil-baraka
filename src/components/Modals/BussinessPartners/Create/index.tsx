import { useState } from "react";
import { Modal } from "antd";
import type { AddBpDataType, AddModalType } from "./types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useLanguage } from "@/hooks/useLanguage";
import SimpleButton from "@/components/ui/SimpleButton";
import useSendRequest from "@/hooks/useSubmitData";
import { useGet } from "@/hooks/useGet";
import type { BpGroupTypes } from "@/types/api/index";
import { generateUrlWithParams } from "@/lib/helpers";

export default function AddBp({ isOpen, onClose }: AddModalType) {
	const { t } = useLanguage("tab.clients");

	const { isSending, sendRequest } = useSendRequest();

	const initialData: AddBpDataType = {
		cardName: "",
		phoneNumber: "",
		groupCode: "",
		groupName: "",
		federalTaxID: "",
		cardForeignName: "",
	};

	const [data, setData] = useState<AddBpDataType>(initialData);

	const { data: bpGroup = [] } = useGet<BpGroupTypes[]>(
		["bpGroup", "businesspartners/groups"],
		generateUrlWithParams("businesspartners/groups", {})
	);

	const bgGroupOptions = bpGroup?.map((bp) => ({
		value: bp.code,
		label: bp.name,
	}));

	const onCloseModal = () => {
		resetState();
		onClose();
	};

	const resetState = () => {
		setData(initialData);
	};

	const postData = () => {
		const body = {
			cardName: data.cardName,
			phoneNumber: data.phoneNumber,
			groupCode: data.groupCode,
			cardForeignName: data.cardForeignName,
			federalTaxID: data.federalTaxID,
		};
		sendRequest({
			url: "/businesspartners",
			data: body,
			method: "POST",
			successMessage: t("success"),
			errorMessage: t("error"),
			showSuccessModal: true,
			showErrorModal: true,
			additionalFn: onCloseModal,
		});
	};

	return (
		<Modal
			centered
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onCloseModal}
			onCancel={onCloseModal}
			footer={null}
			title={<h1 className="font-nunito text-lg font-extrabold text-[#000000]">{t("add")}</h1>}
		>
			<div className="mt-5">
				<div className="flex flex-col gap-2 mb-5">
					<span>{t("cardName")}</span>
					<Input
						placeholder={t("enterCardName")}
						onChange={(e) => setData({ ...data, cardName: e.target.value })}
						value={data?.cardName || ""}
					/>
				</div>
				<div className="flex flex-col gap-2 mb-5">
					<span>{t("cardForeignName")}</span>
					<Input
						placeholder={t("cardForeignName")}
						onChange={(e) => setData({ ...data, cardForeignName: e.target.value })}
						value={data?.cardForeignName || ""}
					/>
				</div>
				<div className="flex flex-col gap-2 mb-5">
					<span>{t("federalTaxID")}</span>
					<Input
						placeholder={t("federalTaxID")}
						onChange={(e) => setData({ ...data, federalTaxID: e.target.value })}
						value={data?.federalTaxID || ""}
					/>
				</div>
				<div className="flex  gap-5 mb-5">
					<div className="flex 	flex-col gap-2 w-full">
						<span>{t("group")}</span>
						<Select
							className="w-full"
							options={bgGroupOptions}
							onChange={(e) => setData({ ...data, groupCode: e })}
							value={data?.groupCode || ""}
							placeholder={t("group")}
						/>
					</div>
					<div className="flex 	flex-col gap-2 w-full">
						<span>{t("phone")}</span>
						<Input
							placeholder={t("phone")}
							className="w-full"
							onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
							value={data?.phoneNumber || ""}
						/>
					</div>
				</div>
				<div className="flex gap-5 mt-8">
					<SimpleButton onClick={onCloseModal} type="primary" content={t("back")} className="h-9" />
					<SimpleButton
						loading={isSending}
						onClick={postData}
						type="secondary"
						content={t("create")}
						className="h-9"
					/>
				</div>
			</div>
		</Modal>
	);
}
