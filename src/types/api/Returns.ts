interface DocumentLinesType {
	lineNum: string | number;
	itemCode: string;
	itemDescription: string;
	itemGroup: string;
	quantity: string | number;
	ugpName: string;
	price: string | number;
	lineTotal: string | number;
	whsName: string;
	warehouseCode: string | number;
	currency: string;
}

interface ReturnTypes {
	docEntry: string | number;
	docNum: string | number;
	cardCode: string;
	cardName: string;
	cellular: string | number;
	balance: string | number;
	docDueDate: string | number;
	docDate: string | number;
	slpCode: number;
	slpName: string;
	docCurrency: string;
	docTotal: string | number;
	comments: string;
	docStatus: string;
	docRate: string | number;
	paidToDate: string | number;
	paidSum: string | number;
	documentLines: DocumentLinesType[];
}

interface ReturnResTypes {
	data: ReturnResTypes[];
	code: number;
	message: string;
}

interface ReturnReportsTypes {
	itemCode: string;
	itemName: string;
	quantity: number | string;
}

interface ReturnReportsResponseTypes {
	data: ReturnReportsTypes[];
	code: number;
	message: string;
}

export type {
	DocumentLinesType,
	ReturnTypes,
	ReturnResTypes,
	ReturnReportsResponseTypes,
	ReturnReportsTypes,
};
