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
		Button: {},
	},
};

export const lightTheme: ThemeConfig = {
	algorithm: defaultAlgorithm,
	token: {
		...commonTokens,
	},
	components: {
		Button: {
			colorPrimary: "inherit", // Red button (primary color)
			colorPrimaryHover: "inherit", // Slightly darker on hover
			colorPrimaryActive: "inherit", // Even darker on active state
			colorText: "inherit", // Default text color
		},
	},
};
