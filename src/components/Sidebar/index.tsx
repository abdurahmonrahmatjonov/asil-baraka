import {
	Box,
	Coins,
	House,
	ShoppingCart,
	Truck,
	Users,
	ChevronLeft,
	ChevronRight,
	ShoppingBasket,
	CreditCard,
	ClipboardList,
	PackageMinus,
} from "lucide-react";
import { PATHS } from "../../routes/path";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { clsx } from "clsx";
import { useState } from "react";
import { getCookie } from "@/lib/actions";
import type { GetMeTypes } from "@/types/api/Auth";

export default function Sidebar() {
	const { t } = useTranslation();
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const getMe: GetMeTypes = getCookie("get_me");

	const sidebarItems = [
		{
			title: t("menu.shipments"),
			icon: <ShoppingCart />,
			path: PATHS.SALES.FINISHED_SALES,
		},
		{
			title: t("menu.stock_transfers"),
			icon: <Truck />,
			path: PATHS.STOCKS.INCOMING_PRODUCTS,
		},

		{
			title: t("menu.stock_reports"),
			icon: <Box />,
			path: PATHS.REPORTS,
		},
		{
			title: t("menu.inventory"),
			icon: <ClipboardList />,
			path: PATHS.INVENTORY,
		},
		{
			title: t("menu.return"),
			icon: <PackageMinus />,
			path: PATHS.RETURN.RETURNS,
		},
	];

	const isActiveRoute = (path: string) => {
		const basePath = path?.split("/")?.slice(0, 2).join("/");
		const currentBasePath = location.pathname?.split("/")?.slice(0, 2)?.join("/");

		return location.pathname.startsWith(path) || currentBasePath === basePath;
	};

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	return (
		<div
			className={clsx(
				"bg-white border-r border-gray-200 py-4 transition-all duration-300 ease-out",
				collapsed ? "w-16" : "w-60"
			)}
		>
			<div className="h-full text-gray-500 flex flex-col gap-4">
				<div
					className={clsx(
						"flex items-center justify-between transition-all duration-300",
						collapsed ? "px-4" : "pl-7 pr-4"
					)}
				>
					<button
						onClick={toggleCollapsed}
						className={clsx(
							"p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200",
							collapsed && "mx-auto"
						)}
					>
						{collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
					</button>
				</div>

				<ul className="w-full flex flex-col relative">
					{sidebarItems.map((item, index) => {
						const isActive = isActiveRoute(item.path);

						return (
							<li key={index} className="relative group">
								<Link
									to={item.path}
									className={clsx(
										"flex items-center gap-4 py-3 cursor-pointer transition-all duration-300 ease-out relative overflow-hidden group",
										collapsed ? "px-4 justify-center" : "pl-7 pr-4",
										isActive
											? "bg-red-50 text-primary border-l-4 border-primary"
											: "text-gray-500 hover:text-primary hover:bg-red-50/50"
									)}
									title={collapsed ? item.title : undefined}
								>
									<div
										className={clsx(
											"absolute left-0 top-0 bottom-0 w-1 bg-red-600 transition-all duration-300 ease-out",
											isActive
												? "opacity-100 scale-y-100"
												: "opacity-0 scale-y-0 group-hover:opacity-50 group-hover:scale-y-100"
										)}
									/>

									<div
										className={clsx(
											"absolute inset-0 bg-red-50 transition-all duration-300 ease-out",
											isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
										)}
									/>

									<div
										className={clsx(
											"flex items-center gap-4 relative z-10",
											collapsed && "justify-center"
										)}
									>
										<div
											className={clsx(
												"w-5 h-5 transition-all duration-300 ease-out flex items-center justify-center",
												isActive
													? "text-red-600 scale-110"
													: "text-gray-500 group-hover:text-red-600 group-hover:scale-105"
											)}
										>
											{item.icon}
										</div>
										{!collapsed && (
											<span
												className={clsx(
													"text-sm transition-all duration-300 ease-out whitespace-nowrap",
													isActive
														? "text-red-600 font-semibold"
														: "text-gray-700 group-hover:text-red-600"
												)}
											>
												{item.title}
											</span>
										)}
									</div>

									<div className="absolute inset-0 overflow-hidden">
										<div className="absolute inset-0 bg-red-600 opacity-0 group-active:opacity-10 transition-opacity duration-150" />
									</div>
								</Link>

								{collapsed && (
									<div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
										{item.title}
										<div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
									</div>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
