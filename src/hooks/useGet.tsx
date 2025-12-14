import api from "@/api/axiosInstance";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
// import { useAlertModal } from "@/context/RequestModalContext";
import { useEffect } from "react";

export function useGet<T>(
	queryKey: string | Array<string | number>,
	url: string,
	isResDataInDataArr = true,
	options = {}
): UseQueryResult<T, AxiosError> {
	// const { showModal } = useAlertModal();

	const normalizedQueryKey: readonly (string | number)[] = Array.isArray(queryKey)
		? queryKey
		: [queryKey];
	const queryResult = useQuery<T, AxiosError>({
		queryKey: normalizedQueryKey,
		queryFn: (): Promise<T> =>
			api.get(url).then((response) => {
				return isResDataInDataArr ? (response.data.data as T) : (response.data as T);
			}),
		retry: false,
		...options,
	});

	useEffect(() => {
		if (queryResult.error && queryResult.error.response?.status !== 401) {
			// showModal({
			// 	type: "error",
			// 	errorMsg: queryResult.error.response?.data?.message,
			// 	onClose: () => {
			// 		queryResult.refetch();
			// 	},
			// });
		}
	}, [queryResult.error]);

	return queryResult;
}
