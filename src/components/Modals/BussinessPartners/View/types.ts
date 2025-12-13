type ViewModalType = {
	onClose: () => void;
	isOpen: boolean;
	data?: any; // Optional data prop for passing additional information
	isEditable?: boolean;
};
type AddModalType = {
	onClose: () => void;
	isOpen: boolean;
};

type AddBpDataType = {
	cardName: string;
	cardCode?: string;
	phoneNumber: string;
	groupCode?: string | number;
	groupName?: string;
	isValid?: string;
	slpCode?: string;
	slpName?: string;
	balance?: number;
	federalTaxID?: string;
	cardForeignName?: string;
};

export type { ViewModalType, AddModalType, AddBpDataType };
