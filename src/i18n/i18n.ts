import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import uz from "./uz.json";
import ru from "./ru.json";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "uz",
		interpolation: {
			escapeValue: false,
		},
		resources: {
			uz: {
				translation: uz,
			},
			ru: {
				translation: ru,
			},
		},
	});

export default i18n;
