export default function formatNumber(
	value: number | string,
	locale: string = "fr-FR",
	options: Intl.NumberFormatOptions = {}
): string {
	if (typeof value === "string") {
		value = parseFloat(value);
	}

	if (isNaN(value)) {
		return "";
	}

	return new Intl.NumberFormat(locale, options).format(value);
}
export function formatNumberInput(value: string | number) {
	// Buni inputni formatlash uchun
	if (!value && value !== 0) return value;

	const stringValue = typeof value === "string" ? value : String(value);

	const isNegative = stringValue.trim().startsWith("-");
	const numericValue = stringValue.replace(/[^\d.,]/g, "");

	const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	return isNegative ? `-${formatted}` : formatted;
}
export const removeSpaces = (value: string | number | undefined | null) => {
	if (!value) return "";
	const stringValue = typeof value === "string" ? value : String(value);
	return stringValue.replace(/\s/g, "");
};
