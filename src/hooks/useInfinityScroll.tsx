import { useRef, useCallback, useEffect } from "react";

export function useInfiniteScroll({
	onLoadMore,
	hasMore = true,
	loading = false,
	threshold = 20,
}: {
	onLoadMore?: () => void | null;
	hasMore?: boolean;
	loading?: boolean;
	threshold?: number;
}) {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const isLoadingRef = useRef(false);

	const handleScroll = useCallback(() => {
		const element = scrollRef.current;
		if (!element || !onLoadMore) {
			return;
		}

		if (loading || !hasMore || isLoadingRef.current) {
			return;
		}

		const { scrollTop, scrollHeight, clientHeight } = element;
		const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

		if (isNearBottom) {
			isLoadingRef.current = true;
			onLoadMore();
		}
	}, [onLoadMore, hasMore, loading, threshold]);

	useEffect(() => {
		if (!loading) {
			isLoadingRef.current = false;
		}
	}, [loading]);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		element.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			element.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	return { scrollRef };
}
