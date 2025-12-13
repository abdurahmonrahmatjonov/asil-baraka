import { Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { Roles } from "../../constants/roles";
import { PATHS } from "../path";

import StockProducts from "../../pages/Stocks/StockProducts";
import ReceivingProducts from "../../pages/Stocks/ReceivingProducts";

import MenuLayout from "@/layout/MenuLayout";
import IncomingProducts from "@/pages/Stocks/IncomingProducts";
import { useTranslation } from "react-i18next";

function StocksRoutes({
	isAuthenticated,
	userRole,
}: {
	isAuthenticated: boolean;
	userRole: Roles;
}) {
	const { t } = useTranslation("");
	const tabs = [
		{ name: t("tab.stocks.stock_items"), path: PATHS.STOCKS.STOCK_PRODUCTS },
		{ name: t("tab.stocks.incoming_items"), path: PATHS.STOCKS.INCOMING_PRODUCTS },
		{ name: t("tab.stocks.receiving_items"), path: PATHS.STOCKS.RECEIVING_PRODUCTS },
	];
	return (
		<Route element={<MenuLayout tabs={tabs} />}>
			<Route
				path={PATHS.STOCKS.STOCK_PRODUCTS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DEVELOPER, Roles.DOKON]}
						userRole={userRole}
					>
						<StockProducts />
					</ProtectedRoute>
				}
			/>

			<Route
				path={PATHS.STOCKS.INCOMING_PRODUCTS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DEVELOPER, Roles.DOKON]}
						userRole={userRole}
					>
						<IncomingProducts />
					</ProtectedRoute>
				}
			/>
			<Route
				path={PATHS.STOCKS.RECEIVING_PRODUCTS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DEVELOPER, Roles.DOKON]}
						userRole={userRole}
					>
						<ReceivingProducts />
					</ProtectedRoute>
				}
			/>
		</Route>
	);
}

export default StocksRoutes;
