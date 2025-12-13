import type { ThemeConfig } from "antd";
import { theme } from "antd";

const { darkAlgorithm, defaultAlgorithm } = theme;

const commonTokens = {
	fontFamily: "Inter, sans-serif",
};

export const darkTheme: ThemeConfig = {
	algorithm: darkAlgorithm,
	token: {
		...commonTokens,
	},
	components: {
		Table: {
			headerBg: "#16171A33",
			headerColor: "#00b96b",
			rowHoverBg: "#262626",
		},
	},
};

export const lightTheme: ThemeConfig = {
	algorithm: defaultAlgorithm,
	token: {
		...commonTokens,
	},
	components: {
		Table: {
			headerBg: "#16171A33",
			headerColor: "#000",
			rowHoverBg: "#f3f4f6", //gray-100
			borderColor: "#d9d9d9",
			rowSelectedBg: "#FF00003F",
			rowSelectedHoverBg: "#FF00001F",
		},
		Checkbox: {
			colorPrimary: "#CF0920",
			colorPrimaryHover: "#cc0000",
		},
	},
};
