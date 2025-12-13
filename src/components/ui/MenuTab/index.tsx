import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function MenuTab({ name, path }: { name: string; path: string }) {
	const location = useLocation();
	console.log("location", location.pathname, path);
	const isActive = location.pathname === path;
	const { t } = useTranslation();

	return (
		<div className="flex flex-col h-full justify-between gap-2 py-2 relative">
			<Link
				to={path}
				className={clsx(
					"px-3 py-2 rounded-md transition-all duration-300 relative",
					isActive
						? "text-primary bg-red-300/20 font-semibold"
						: "text-gray-400 hover:text-gray-500 underline"
				)}
			>
				{t(name)}

				<span
					className={clsx(
						"absolute left-0 -bottom-1 h-[2px] w-full rounded bg-primary transition-all duration-300",
						isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
					)}
				/>
			</Link>
		</div>
	);
}
