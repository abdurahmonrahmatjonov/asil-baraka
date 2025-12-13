import { Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { Roles } from "../../constants/roles";
import { PATHS } from "../path";
import MenuLayout from "@/layout/MenuLayout";
import Reports from "@/pages/Reports";

function ReportsRoutes({
	isAuthenticated,
	userRole,
}: {
	isAuthenticated: boolean;
	userRole: Roles;
}) {
	return (
		<Route element={<MenuLayout />}>
			<Route
				path={PATHS.REPORTS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<Reports />
					</ProtectedRoute>
				}
			/>
		</Route>
	);
}

export default ReportsRoutes;
