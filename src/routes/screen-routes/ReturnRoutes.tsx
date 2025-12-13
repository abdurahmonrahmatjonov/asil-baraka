import { Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { Roles } from "../../constants/roles";
import { PATHS } from "../path";
import { useLanguage } from "@/hooks/useLanguage";
import MenuLayout from "@/layout/MenuLayout";

import Returns from "@/pages/Returns/Returns";
import ReturnHistory from "@/pages/Returns/History";
import ReturnReports from "@/pages/Returns/Reports";

function ReturnRoutes({
	isAuthenticated,
	userRole,
}: {
	isAuthenticated: boolean;
	userRole: Roles;
}) {
	const { t } = useLanguage("tab.return");
	const tabs = [
		{ name: t("returns"), path: PATHS.RETURN.RETURNS },
		{ name: t("history_returns"), path: PATHS.RETURN.HISTORY_RETURNS },
		{ name: t("return_reports"), path: PATHS.RETURN.RETURN_REPORTS },
	];
	return (
		<Route element={<MenuLayout tabs={tabs} />}>
			<Route
				path={PATHS.RETURN.RETURNS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<Returns />
					</ProtectedRoute>
				}
			/>
			<Route
				path={PATHS.RETURN.HISTORY_RETURNS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<ReturnHistory />
					</ProtectedRoute>
				}
			/>

			<Route
				path={PATHS.RETURN.RETURN_REPORTS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<ReturnReports />
					</ProtectedRoute>
				}
			/>
		</Route>
	);
}

export default ReturnRoutes;
