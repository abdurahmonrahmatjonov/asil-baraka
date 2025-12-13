type ViewModalType = {
	onClose: () => void;
	isOpen: boolean;
	data?: any; // Optional data prop for passing additional information
	isShowChangeBtn?: boolean;
	isShowCloseBtn?: boolean;
	isShowDeleteBtn?: boolean;
	isShowCancelBtn?: boolean;
	isShowPayBtn?: boolean;
	isShowReturnBtn?: boolean;
	isShowCopyToInvoiceBtn?: boolean;
	isShowPaidToDate?: boolean;
	isShowPrices?: boolean;
	isShowOpenQty?: boolean;
	isEditable?: boolean;
	isShowReceiveBtn?: boolean;
	isShowPdfBtn?: boolean;
	isShowAddBtn?: boolean;
};
type AddModalType = {
	onClose: () => void;
	isOpen: boolean;
	postType?: "order" | "invoice";
	isShowBinLocation?: boolean;
};

type AddBpDataType = {
	cardName: string;
	phoneNumber: string;
	groupCode: string;
	groupName?: string;
	federalTaxID?: string;
	cardForeignName?: string;
};

export type { ViewModalType, AddModalType, AddBpDataType };
