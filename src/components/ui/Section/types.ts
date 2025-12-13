import type { FilterTypes } from "../Filter/types";
import type { ColumnsTypes } from "../Table/types";

interface SectionProps {
	onClearFilters?: () => void;
	filters?: FilterTypes[];
	data?: any[];
	columns?: ColumnsTypes[];
	subTabs?: SubTab[];
	hasSubTabs?: boolean;
	showAddBtn?: boolean;
	handleAddBtnClick?: () => void;
	addBtnText?: string;
	rowClassName?: (record: any, index: number) => string;
	scrollTable?: { x?: string | number; y?: string | number };
	isShowPaginationBtn?: boolean;
	handleNextPage?: () => void;
	handlePrevPage?: () => void;
	currentPage?: number;
	isNextPageDisabled?: boolean;
	isPrevPageDisabled?: boolean;
	loading?: boolean;
	isShowPageSize?: boolean;
	handlePageSizeChange?: (pageSize: number) => void;
	pageSize?: number;
}

interface MainSectionProps {
	onClearFilters?: () => void;
	filters?: FilterTypes[];
	data?: any[];
	columns?: ColumnsTypes[];
	onLoadMore?: () => void;
	hasMore?: boolean;
	showAddBtn?: boolean;
	handleAddBtnClick?: () => void;
	addBtnText?: string;
	rowClassName?: (record: any, index: number) => string;
	scrollTable?: { x?: string | number; y?: string | number };
	isShowPaginationBtn?: boolean;
	handleNextPage?: () => void;
	handlePrevPage?: () => void;
	currentPage?: number;
	isNextPageDisabled?: boolean;
	isPrevPageDisabled?: boolean;
}

interface SubTab {
	name: string;
	children: React.ReactNode;
}

interface SubTabsSectionProps {
	subTabs: SubTab[];
	className?: string;
}

export type { SectionProps, MainSectionProps, SubTab, SubTabsSectionProps };
