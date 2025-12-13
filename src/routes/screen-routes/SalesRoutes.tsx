import { Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { Roles } from "../../constants/roles";
import { PATHS } from "../path";
import { useLanguage } from "@/hooks/useLanguage";
import MenuLayout from "@/layout/MenuLayout";
import SalesReports from "@/pages/Sales/SalesReports";
import FinishedSales from "@/pages/Sales/FinishedSales";

function SalesRoutes({ isAuthenticated, userRole }: { isAuthenticated: boolean; userRole: Roles }) {
	const { t } = useLanguage("tab.sales");
	const tabs = [
		{ name: t("shipments"), path: PATHS.SALES.FINISHED_SALES },
		{ name: t("sales_reports"), path: PATHS.SALES.SALES_REPORTS },
	];
	return (
		<Route element={<MenuLayout tabs={tabs} />}>
			<Route
				path={PATHS.SALES.FINISHED_SALES}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<FinishedSales />
					</ProtectedRoute>
				}
			/>

			<Route
				path={PATHS.SALES.SALES_REPORTS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<SalesReports />
					</ProtectedRoute>
				}
			/>
		</Route>
	);
}

export default SalesRoutes;
