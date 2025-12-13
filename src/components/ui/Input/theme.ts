import { colors } from "@/assets/colors";
import type { ThemeConfig } from "antd";
import { theme } from "antd";

const { darkAlgorithm, defaultAlgorithm } = theme;

const commonTokens = {
	fontFamily: "Inter, sans-serif",
};

// Extend ThemeConfig to include Input
interface CustomThemeConfig extends ThemeConfig {
	components?: ThemeConfig["components"] & {
		Input?: {
			colorPrimary?: string;
			colorPrimaryHover?: string;
			colorBgContainer?: string;
			colorBorder?: string;
			colorText?: string;
			colorTextPlaceholder?: string;
			colorBgContainerDisabled?: string;
			colorBorderHover?: string;
			colorTextDisabled?: string;
			borderRadius?: number;
		};
	};
}

export const darkTheme: CustomThemeConfig = {
	algorithm: darkAlgorithm,
	token: {
		...commonTokens,
		colorText: "#ffffff",
		colorBgContainer: "#1f1f1f",
		colorBorder: "#434343",
		colorPrimary: "#CF0920", // Your main color
	},
	components: {
		Input: {
			colorPrimary: "#CF0920", // Primary color for active states
			colorPrimaryHover: "#B0081B", // Slightly darker for hover
			colorBgContainer: "#1f1f1f", // Dark background for input
			colorBorder: "#434343", // Subtle border
			colorText: "#ffffff", // White text for readability
			colorTextPlaceholder: "#ffffff", // Muted placeholder
			colorBgContainerDisabled: "#2d2d2d", // Slightly lighter when disabled
			colorBorderHover: "#CF0920", // Primary color for hover border
			colorTextDisabled: "#595959", // Muted text when disabled
			borderRadius: 4, // Consistent border radius
		},
	},
};

export const lightTheme: CustomThemeConfig = {
	algorithm: defaultAlgorithm,
	token: {
		...commonTokens,
		colorText: "#000000",
		colorBgContainer: "#ffffff",
		colorBorder: "#d9d9d9",
		colorPrimary: "#CF0920", // Your main color
	},
	components: {
		Input: {
			colorPrimary: "#CF0920", // Primary color for active states
			colorPrimaryHover: "#B0081B", // Slightly darker for hover
			colorBgContainer: "#ffffff", // White background
			colorBorder: "#d9d9d9", // Light border
			colorText: "#000000", // Dark text for readability
			colorTextPlaceholder: "#bfbfbf", // Muted placeholder
			colorBgContainerDisabled: "#f5f5f5", // Light grey when disabled
			colorBorderHover: colors.primary, // Use #CF0920 for hover border
			colorTextDisabled: "#d9d9d9", // Muted text when disabled
			borderRadius: 4, // Consistent border radius
		},
	},
};
