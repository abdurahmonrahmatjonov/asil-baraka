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
	itemPrice: string | number;
	quantityPerPackage: string | number;
}

interface SalesDataTypes {
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

interface SalesResponseTypes {
	data: SalesDataTypes[];
	code: number;
	message: string;
}

interface SalesReportsTypes {
	itemCode: string;
	itemName: string;
	quantity: number | string;
}

interface SalesReportsResponseTypes {
	data: SalesReportsTypes[];
	code: number;
	message: string;
}

export type {
	DocumentLinesType,
	SalesDataTypes,
	SalesResponseTypes,
	SalesReportsResponseTypes,
	SalesReportsTypes,
};
