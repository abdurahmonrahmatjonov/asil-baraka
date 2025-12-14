export const PATHS = {
	// ========== ROOT ==========
	ROOT: "/",

	STOCKS: {
		STOCK_PRODUCTS: "/stocks/stock-products",
		INCOMING_PRODUCTS: "/stocks/incoming-products",
		RECEIVING_PRODUCTS: "/stocks/receiving-products",
	},

	SALES: {
		FINISHED_SALES: "/sales/finished-sales",
		SALES_REPORTS: "/sales/sales-reports",
	},
	RETURN: {
		RETURNS: "/return/returns",
		HISTORY_RETURNS: "/return/history-returns",
		RETURN_REPORTS: "/return/return-reports",
	},

	PDF: {
		SALES: "/pdf/sales/:docEntry",
		REPORTS: "/pdf/reports",
	},
	REPORTS: "/reports",
	INVENTORY: "/inventory",

	// ========== AUTH ==========
	LOGIN: "/login",
	UNAUTHORIZED: "/unauthorized",

	// ========== ERROR ==========
	ERROR: "/error",
	NOT_FOUND: "*",
};
