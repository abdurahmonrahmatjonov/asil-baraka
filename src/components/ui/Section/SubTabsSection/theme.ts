import { theme } from "antd";
import type { ThemeConfig } from "antd";

const { defaultAlgorithm } = theme;

export const lightTheme: ThemeConfig = {
	algorithm: defaultAlgorithm,
	token: {
		fontFamily: "Inter, sans-serif",
		colorText: "#000000", // Dark text for readability
		colorBgContainer: "#ffffff", // White background
		colorBorder: "#d9d9d9", // Light border
		colorPrimary: "#CF0920", // Your main color
	},
	components: {
		Tabs: {
			cardPadding: "0", // Remove padding for card-type tabs
			margin: 0, // Remove all margins
			cardGutter: 0, // Remove gap between card tabs
			horizontalItemPadding: "0px", // Remove horizontal padding for tab content
			horizontalMargin: "0px", // Remove horizontal margin for tab bar
			colorPrimary: "#CF0920", // Primary color for active states
			colorPrimaryHover: "#B0081B", // Slightly darker for hover
			colorBgContainer: "#ffffff", // White background
			colorBorder: "#d9d9d9", // Light border
			colorText: "#000000", // Dark text for readability
			colorTextPlaceholder: "#bfbfbf", // Muted placeholder
			colorBgContainerDisabled: "#f5f5f5", // Light grey when disabled
			colorTextDisabled: "#d9d9d9", // Muted text when disabled
		},
	},
};
