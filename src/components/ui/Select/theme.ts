import type { ThemeConfig } from "antd";
import { theme } from "antd";

const { darkAlgorithm, defaultAlgorithm } = theme;

const commonTokens = {
	fontFamily: "Inter, sans-serif",
};

// Extend ThemeConfig to include Select
interface CustomThemeConfig extends ThemeConfig {
	components?: ThemeConfig["components"] & {
		Select?: {
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
			colorBgElevated?: string;
			colorTextDescription?: string;
			controlItemBgHover?: string;
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
		Select: {
			colorPrimary: "#CF0920", // Primary color for active states (e.g., selected option)
			colorPrimaryHover: "#B0081B", // Slightly darker for hover
			colorBgContainer: "#1f1f1f", // Dark background for input
			colorBorder: "#434343", // Subtle border
			colorText: "#ffffff", // White text for readability
			colorTextPlaceholder: "#8c8c8c", // Muted placeholder
			colorBgContainerDisabled: "#2d2d2d", // Slightly lighter when disabled
			colorBorderHover: "#CF0920", // Primary color for hover border
			colorTextDisabled: "#595959", // Muted text when disabled
			borderRadius: 4, // Consistent border radius
			colorBgElevated: "#2d2d2d", // Dropdown background
			colorTextDescription: "#d9d9d9", // Option text
			// controlItemBgHover removed to use default
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
		Select: {
			colorPrimary: "#CF0920", // Primary color for active states (e.g., selected option)
			colorPrimaryHover: "#B0081B", // Slightly darker for hover, consistent with darkTheme
			colorBgContainer: "#ffffff", // White background
			colorBorder: "#d9d9d9", // Light border
			colorText: "#000000", // Dark text for readability
			colorTextPlaceholder: "#bfbfbf", // Muted placeholder
			colorBgContainerDisabled: "#f5f5f5", // Light grey when disabled
			colorBorderHover: "#CF0920", // Use #CF0920 for hover border
			colorTextDisabled: "#d9d9d9", // Muted text when disabled
			borderRadius: 4, // Consistent border radius
			colorBgElevated: "#ffffff", // Dropdown background
			colorTextDescription: "#000000", // Option text
			// controlItemBgHover removed to use default
		},
	},
};
