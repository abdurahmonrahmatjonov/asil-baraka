interface InventoryTRLinesTypes {
	fromWarehouseCode: string;
	fromWarehouseName: string;
	itemCode: string;
	itemDescription: string;
	lineNum: number;
	quantity: number | string;
	uoMCode: number | string;
	uoMName: string;
	warehouseCode: string;
	warehouseName: string;
	onHand?: number;
}
interface InventoryTRResType {
	cardCode?: string;
	cardName?: string;
	docDate?: string;
	docEntry?: number;
	docNum?: number;
	docTotal?: number;
	fromWarehouse?: string;
	fromWarehouseName?: string;
	toWarehouse?: string;
	toWarehouseName?: string;
	documentStatus?: string;
	dueDate?: string;
	stockTransferLines?: InventoryTRLinesTypes[];
}

export type { InventoryTRResType, InventoryTRLinesTypes };
