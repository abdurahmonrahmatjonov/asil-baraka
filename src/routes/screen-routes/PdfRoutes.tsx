import { Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { Roles } from "../../constants/roles";
import { PATHS } from "../path";
import MenuLayout from "@/layout/MenuLayout";
import SalesPDF from "@/pages/DownloadPDF/Sales";
import ReportsPDF from "@/pages/DownloadPDF/Reports";

function PdfRoutes({ isAuthenticated, userRole }: { isAuthenticated: boolean; userRole: Roles }) {
	return (
		<Route element={<MenuLayout />}>
			<Route
				path={PATHS.PDF.SALES}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<SalesPDF />
					</ProtectedRoute>
				}
			/>
			<Route
				path={PATHS.PDF.REPORTS}
				element={
					<ProtectedRoute
						isAuthenticated={isAuthenticated}
						allowedRoles={[Roles.DIREKTOR, Roles.DOKON]}
						userRole={userRole}
					>
						<ReportsPDF />
					</ProtectedRoute>
				}
			/>
		</Route>
	);
}

export default PdfRoutes;
