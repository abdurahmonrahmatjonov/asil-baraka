import { Image, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import ErrorImage from "/images/error-modal-image.png";
import SuccessImage from "/images/success-modal-image.png";

export default function AlertModal({
	type,
	isOpen,
	onClose,
	errorMessage,
	successMessage,
}: {
	type: "error" | "success";
	isOpen: boolean;
	onClose: () => void;
	errorMessage?: string;
	successMessage?: string;
}) {
	const { t } = useTranslation();

	return (
		<Modal
			className="!z-[9999]"
			centered
			zIndex={10000}
			footer={
				<div className="flex justify-center">
					<button
						className={clsx(
							"flex items-center justify-center py-1 px-2.5 text-white rounded-lg transition-colors",
							type === "error" ? "bg-red-500 hover:bg-red-400" : "bg-[#09CFB8] hover:bg-[#69e3d5]"
						)}
						onClick={onClose}
					>
						{type === "error" && <ChevronLeft />}
						{type === "success" ? t("button.done") : t("button.back")}
						{type === "success" && <ChevronRight />}
					</button>
				</div>
			}
			width={485}
			height={485}
			closable={{ "aria-label": "Custom Close Button" }}
			open={isOpen}
			onOk={onClose}
			onCancel={onClose}
		>
			<div
				className={clsx(
					"flex flex-col items-center justify-center z-[9999]",
					type === "error" ? "gap-0" : "gap-6"
				)}
			>
				<Image
					src={type === "error" ? ErrorImage : SuccessImage}
					alt={type === "error" ? "Error Image" : "Success Image"}
					preview={false}
					height={type === "error" ? 250 : 180}
					width={type === "error" ? 250 : 180}
				/>
				<h2 className="text-2xl font-semibold text-center text-wrap text-sm">
					{type === "error"
						? t(errorMessage || "modal.error")
						: t(successMessage || "modal.success")}
				</h2>
			</div>
		</Modal>
	);
}
