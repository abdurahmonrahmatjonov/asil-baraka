import { Button as AntButton, ConfigProvider } from "antd";
import { darkTheme, lightTheme } from "./theme";
import type { ComponentProps, ReactNode } from "react";
interface CustomButtonProps extends Omit<ComponentProps<typeof AntButton>, "type"> {
	onClick?: () => void;
	className?: string;
	loading?: boolean;
	isActive?: boolean;
	children?: ReactNode;
	hasShadow?: boolean;
	shadowColor?: string;
	shadowColorActive?: string;
	textColor?: string;
	textColorActive?: string;
	textColorHover?: string;
	textColorActiveHover?: string;
	bgColor?: string;
	bgColorHover?: string;
}
interface ButtonLinkProps extends Omit<ComponentProps<typeof AntButton>, "type"> {
	onClick?: () => void;
	className?: string;
	loading?: boolean;
	isActive?: boolean;
	children?: ReactNode;
}

export default function Button({
	onClick,
	className = "",
	loading = false,
	isActive = false,
	children = "",
	hasShadow = true,
	shadowColor = "shadow-gray-500",
	shadowColorActive = "shadow-red-500",
	textColor = "text-gray-500",
	textColorActive = "text-primary",
	textColorHover = "text-gray-700",
	textColorActiveHover = "text-primary-hover",
	bgColor = "inherit",
	bgColorHover = "inherit",
	...props
}: CustomButtonProps) {
	const darkMode = false;

	return (
		<ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
			<AntButton
				type="default"
				className={`font-semibold ${
					isActive
						? `${shadowColorActive} ${textColorActive} hover:!${textColorActiveHover}`
						: `${shadowColor} ${textColor} hover:!${textColorHover}`
				} ${hasShadow ? "shadow-md" : ""} ${bgColor} hover:!${bgColorHover} h-8 ${className}`}
				loading={loading}
				onClick={onClick}
				disabled={loading}
				{...props}
			>
				{children}
			</AntButton>
		</ConfigProvider>
	);
}

export function ButtonLink({
	onClick,
	className = "",
	loading = false,
	isActive = false,
	children = "",
	...props
}: ButtonLinkProps) {
	const darkMode = false;

	return (
		<ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
			<AntButton
				type="link"
				className={`!text-gray-500 shadow-md hover:!text-primary hover:!bg-red-200 font-semibold ${
					isActive ? "bg-red-200 !text-primary" : "inherit"
				} ${className}`}
				loading={loading}
				onClick={onClick}
				disabled={loading}
				{...props}
			>
				{children}
			</AntButton>
		</ConfigProvider>
	);
}
