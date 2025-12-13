import React, { type ReactNode } from "react";
import clsx from "clsx";
import { LoaderIcon } from "lucide-react";

interface SimpleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
	onClick?: () => void;
	className?: string;
	loading?: boolean;
	type: "primary" | "secondary" | "accent" | "red" | "yellow";
	content?: string;
	icon?: ReactNode;
	rounded?: "lg" | "xl" | "2xl" | "full" | "none";
}

export default function SimpleButton({
	onClick,
	className = "",
	loading = false,
	type = "primary",
	icon = null,
	content = "",
	rounded = "xl",
	disabled = false,
	...props
}: SimpleButtonProps) {
	const isDisabled = loading || disabled;

	return (
		<button
			className={clsx(
				`flex items-center justify-center gap-2 font-semibold text-white w-full h-12 rounded-${rounded} transition-colors`,
				// Base colors with hover states
				type === "primary" && !isDisabled && "bg-primary hover:bg-red-400",
				type === "secondary" && !isDisabled && "bg-secondary hover:bg-secondary-hover",
				type === "accent" && !isDisabled && "bg-cyan-400 hover:bg-cyan-500",
				type === "red" && !isDisabled && "bg-red-500 hover:bg-red-600",
				type === "yellow" && !isDisabled && "bg-yellow-400 hover:bg-yellow-500",
				// Disabled states
				type === "primary" && isDisabled && "bg-red-300",
				type === "secondary" && isDisabled && "bg-gray-300",
				type === "accent" && isDisabled && "bg-cyan-300",
				type === "red" && isDisabled && "bg-red-300",
				type === "yellow" && isDisabled && "bg-yellow-300",
				// General disabled styling
				isDisabled && "cursor-not-allowed opacity-60",
				className
			)}
			onClick={onClick}
			disabled={isDisabled}
			{...props}
		>
			{loading ? (
				<>
					<div className="animate-spin">
						<LoaderIcon />
					</div>
					{content}
				</>
			) : (
				<>
					{icon}
					{content || "—"}
				</>
			)}
		</button>
	);
}
