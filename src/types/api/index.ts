interface BpTypes {
	cardName: string;
	cardCode: string;
	Cellular: string;
	balance: number;
	isValid: string;
	slpCode: string;
	slpName: string;
	priceList: string;
}
interface BpGroupTypes {
	code: string | number;
	name: string;
	type: string;
}

interface SlpTypes {
	slpCode: string;
	slpName: string;
}

interface ItemTypes {
	currency: string;
	itemCode: string;
	itemName: string;
	itemGroup: string;
	itemType: string;
	itmsGrpCod: string | number;
	price: number | string;
	uoMName: string;
}
interface ItemGroupTypes {
	itmsGrpCod: string;
	itmsGrpNam: string;
}
interface WhsTypes {
	warehouseCode: string;
	warehouseName: string;
}

interface CashAccTypes {
	acctCode: string;
	acctName: string;
	actCurr: string;
}

export type { BpTypes, ItemTypes, WhsTypes, BpGroupTypes, ItemGroupTypes, SlpTypes, CashAccTypes };
