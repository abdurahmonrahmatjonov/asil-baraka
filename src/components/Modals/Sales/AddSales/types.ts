interface DocLineType {
	itemCode?: string;
	itemDescription?: string;
	itemName?: string;
	quantity?: string | number;
	price?: string | number;
	currency?: string;
	whsName?: string;
	lineTotal?: string | number;
	whsCode?: string | number;
	lineNum?: number;
	itemGroup?: string;
	ugpName?: string;
	warehouseCode?: string | number;
	discountPercent?: number;
}

interface DataType {
	cardName: string;
	cardCode: string;
	docDate: string;
	docRate: string | number;
	docTotal?: string | number;
	currency: string;
	slpCode: string | number;
	slpName: string;
	comments: string;
	docDueDate: string;
	whsCode: string | number;
}

export type { DocLineType, DataType };
