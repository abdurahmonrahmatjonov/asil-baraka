interface DocumentLinesType {
	itemCode: string;
	itemDescription: string;
	itemGroup: string;
	lineTotal: number | string;
	lineNum: number;
	price: number | string;
	quantity: number | string;
	ugpName: string;
	warehouseCode: string | number;
	whsName: string;
	binLocations?: any[];
	itemsBinLocations?: any[];
	bisEntry?: string | number;
	bisCode?: string | number;
	u_BinCode?: string | number;
	u_BinAbsEntry?: string | number;
	inStock?: string | number;
}

interface SalesDataTypes {
	balance: number | string;
	cardCode: string;
	cardName: string;
	cellular: string | number | null;
	comments: string | null;
	docCurrency: string;
	docDate: string;
	docDueDate: string;
	docEntry: number;
	docNum: number;
	docTotal: number | string;
	slpCode: number | string;
	docStatus: string;
	paidToDate?: number | string;
	paidSum?: number | string;
	docRate?: number | string;
	slpName: string;
	documentLines: DocumentLinesType[];
}

interface SalesResponseTypes {
	data: SalesDataTypes[];
	code: number;
	message: string;
}

export type { DocumentLinesType, SalesDataTypes, SalesResponseTypes };
