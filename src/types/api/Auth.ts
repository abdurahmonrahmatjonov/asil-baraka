export type Login = {
	firstName: string;
	lastName: string;
	employeeId: number;
	salesPersonCode: number | string;
	jobTitle: string;
	wareHouse: number | string;
	accessToken: string;
	refreshToken: string;
};

export type GetMeTypes = {
	firstName: string;
	lastName: string;
	employeeId: number;
	salesPersonCode: number | string;
	jobTitle: string;
	wareHouse: number | string;
	accessToken: string;
	refreshToken: string;
	u_CashAccount: string;
	u_CardAccount: string;
	u_CashAccountUZS: string;
};
