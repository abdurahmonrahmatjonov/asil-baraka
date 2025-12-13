import { useTranslation } from "react-i18next";

export function useLanguage(path: string) {
	const { t: tRoot } = useTranslation("");
	const t = (key: string) => tRoot(`${path}.${key}`);

	return { t };
}
