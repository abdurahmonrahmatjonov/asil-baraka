import api from "@/api/axiosInstance";
import { useAlertModal } from "@/context/RequestModalContext";
import type { ApiResponse } from "@/types/api";
import { AxiosError, type Method } from "axios";
import { useState } from "react";

export type RequestResult<T> = ApiResponse<T> & {
	success: boolean;
};

export default function useSendRequest() {
	const { showModal } = useAlertModal();
	const [isSending, setIsSending] = useState(false);

	async function sendRequest<T>({
		url,
		data,
		method,
		successMessage,
		errorMessage,
		showSuccessModal = true,
		showErrorModal = true,
		additionalFn = () => {},
	}: {
		url: string;
		data?: any;
		method: Method;
		successMessage?: string;
		errorMessage?: string;
		showSuccessModal?: boolean;
		showErrorModal?: boolean;
		additionalFn?: () => void;
	}): Promise<RequestResult<T>> {
		setIsSending(true);

		try {
			const response = await api.request<ApiResponse<T>>({ url, data, method });
			const apiResponse = response.data;

			const message = successMessage || apiResponse.message || "Success";
			if (additionalFn) additionalFn();
			if (showSuccessModal) {
				showModal({
					type: "success",
					successMsg: message,
					onClose: () => {},
				});
			}

			return {
				success: true,
				code: apiResponse.code,
				message,
				data: apiResponse.data,
			};
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<any>>;
			const apiErrorResponse = axiosError.response?.data;

			console.log(apiErrorResponse);

			const message = apiErrorResponse?.errors
				? Object.values(apiErrorResponse?.errors).flat().join(" ")
				: apiErrorResponse?.message || errorMessage || axiosError.message || "An error occurred";

			const code = apiErrorResponse?.code || axiosError.response?.status || 500;
			// if (additionalFn) additionalFn();

			if (showErrorModal) {
				showModal({
					type: "error",
					errorMsg: message,
					onClose: () => {},
				});
			}

			return {
				success: false,
				code,
				message,
				data: apiErrorResponse?.data,
			};
		} finally {
			setIsSending(false);
		}
	}

	return { sendRequest, isSending };
}
