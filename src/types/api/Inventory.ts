interface InventoryResDataTypes {
	docEntry?: number;
	docNum?: number | string;
	countDate?: string;
	time?: string;
	takerId?: number | string;
	takerName?: string;
	status?: string;
	whsCode?: string | number;
	whsName?: string;
	documentLines?: InventoryLinesTypes[];
}

interface InventoryLinesTypes {
	lineNum?: number;
	itemCode?: string;
	itemDescription?: string;
	itemName?: string;
	whsCode?: string;
	whsName?: string;
	inWhsQty?: string;
	countQty?: string;
	difference?: string;
	isCounted?: string;
	uomName?: string;
}

export type { InventoryResDataTypes, InventoryLinesTypes };
