interface DocLineType {
	itemCode: string;
	itemName: string;
	quantity: string | number;
	price: string | number;
	currency: string;
	whsName?: string;
	lineTotal: string | number;
	whsCode?: string;
	isCommited: string | number;
	onOrder: string | number;
}

interface DataType {
	cardName: string;
	cardCode: string;
	docDate: string;
	docRate: string | number;
	docTotal?: string | number;
	typeOrder: string;
	currency: string;
	slpCode: string;
	slpName: string;
	comments: string;
}

export type { DocLineType, DataType };
