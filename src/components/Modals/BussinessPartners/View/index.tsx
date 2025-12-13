import { useEffect, useState } from "react";
import { Modal } from "antd";
import type { AddBpDataType, ViewModalType } from "./types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useLanguage } from "@/hooks/useLanguage";
import SimpleButton from "@/components/ui/SimpleButton";
import useSendRequest from "@/hooks/useSubmitData";
import { useGet } from "@/hooks/useGet";
import { generateUrlWithParams } from "@/lib/helpers";
import type { BpGroupTypes } from "@/types/api/";

export default function ViewBp({
	isOpen,
	onClose,
	data: viewData,
	isEditable = true,
}: ViewModalType) {
	const { t } = useLanguage("tab.clients");

	const { isSending, sendRequest } = useSendRequest();

	const initialData: AddBpDataType = {
		cardCode: "",
		cardName: "",
		phoneNumber: "",
		groupCode: "",
		groupName: "",
		isValid: "",
	};

	const [data, setData] = useState<AddBpDataType>(initialData);

	useEffect(() => {
		if (viewData) {
			setData({
				cardName: viewData.cardName,
				cardCode: viewData.cardCode,
				phoneNumber: viewData.Cellular,
				isValid: viewData.isValid,
				groupCode: +viewData?.groupCode,
				groupName: viewData?.groupName,
				federalTaxID: viewData?.licTradNum,
				cardForeignName: viewData?.cardFName,
			});
		}
	}, [viewData, isOpen]);

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

	const patchData = () => {
		const body = {
			cardName: data.cardName,
			cellular: data.phoneNumber,
			groupCode: data.groupCode,
			valid: data.isValid,
			cardForeignName: data.cardForeignName,
			federalTaxID: data.federalTaxID,
		};
		sendRequest({
			url: `/businesspartners/${data.cardCode}`,
			data: body,
			method: "PATCH",
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
			title={<h1 className="font-nunito text-lg font-extrabold text-[#000000]">{t("viewBp")}</h1>}
		>
			<div className="mt-5">
				<div className="flex flex-col gap-2 mb-5">
					<span>{t("cardName")}</span>
					<Input
						placeholder={t("enterCardName")}
						onChange={(e) => setData({ ...data, cardName: e.target.value })}
						value={data?.cardName || ""}
						disabled={!isEditable}
					/>
				</div>
				<div className="flex flex-col gap-2 mb-5">
					<span>{t("cardForeignName")}</span>
					<Input
						placeholder={t("cardForeignName")}
						onChange={(e) => setData({ ...data, cardForeignName: e.target.value })}
						value={data?.cardForeignName || ""}
						disabled={!isEditable}
					/>
				</div>
				<div className="flex flex-col gap-2 mb-5">
					<span>{t("federalTaxID")}</span>
					<Input
						placeholder={t("federalTaxID")}
						onChange={(e) => setData({ ...data, federalTaxID: e.target.value })}
						value={data?.federalTaxID || ""}
						disabled={!isEditable}
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
							disabled={!isEditable}
						/>
					</div>
					<div className="flex 	flex-col gap-2 w-full">
						<span>{t("phone")}</span>
						<Input
							placeholder={t("phone")}
							className="w-full"
							onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
							value={data?.phoneNumber || ""}
							disabled={!isEditable}
						/>
					</div>
				</div>
				{isEditable && (
					<div className="flex gap-5 mt-8">
						<SimpleButton
							onClick={onCloseModal}
							type="primary"
							content={t("back")}
							className="h-9"
						/>
						<SimpleButton
							loading={isSending}
							onClick={patchData}
							type="secondary"
							content={t("save")}
							className="h-9"
						/>
					</div>
				)}
			</div>
		</Modal>
	);
}
