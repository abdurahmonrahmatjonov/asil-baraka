interface BusinessPartnerInfoLinesTypes {
	credit: number;
	cumulativeBalance: number | string;
	debit: number;
	docNum: string;
	dueDate: string;
	lineMemo: string;
}
interface AktSverkaResTypes {
	balance: number | string;
	balanceFirstDayOfPeriod: number | string;
	cardCode: string;
	cardName: string;
	businessPartnerInfoLines: BusinessPartnerInfoLinesTypes[];
}

export type { AktSverkaResTypes, BusinessPartnerInfoLinesTypes };
