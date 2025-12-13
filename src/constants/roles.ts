export const Roles = {
	ADMIN: "admin",
	DEVELOPER: "developer",
	DOKON: "Dokon",
	DIREKTOR: "Direktor",
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];
