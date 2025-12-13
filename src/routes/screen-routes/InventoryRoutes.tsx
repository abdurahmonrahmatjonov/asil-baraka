import { Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { Roles } from "../../constants/roles";
import { PATHS } from "../path";
import MenuLayout from "@/layout/MenuLayout";
import Inventory from "@/pages/Inventory";

function InventoryRoutes({
	isAuthenticated,
	userRole,
}: {
	isAuthenticated: boolean;
	userRole: Roles;
}) {
	return (
		<Route element={<MenuLayout />}>
			<Route
				path={PATHS.INVENTORY}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<Inventory />
					</ProtectedRoute>
				}
			/>
		</Route>
	);
}

export default InventoryRoutes;
