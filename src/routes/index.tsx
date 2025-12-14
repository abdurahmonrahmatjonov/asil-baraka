// ========== Imports =========
import { Route, Routes, Navigate } from "react-router-dom";
import { PATHS } from "./path";
import { Roles } from "../constants/roles";
import RootLayout from "../layout/RootLayout";

// ========== Pages/Menus ==========
import StocksRoutes from "./screen-routes/StocksRoutes";
import SalesRoutes from "./screen-routes/SalesRoutes";

// ========== AUTH (Additional) Pages/Menus ==========
import LoginScreen from "../pages/Login";
import NotFoundScreen from "../pages/NotFound";
import ErrorScreen from "../pages/Error";
import { getCookie } from "@/lib/actions";
import ReportsRoutes from "./screen-routes/ReportRoutes";
import PdfRoutes from "./screen-routes/PdfRoutes";
import ReturnRoutes from "./screen-routes/ReturnRoutes";
import InventoryRoutes from "./screen-routes/InventoryRoutes";

export default function AppRoutes() {
	const isAuthenticated = getCookie("access_token") !== undefined;
	const userRole: Roles = getCookie("user_role");

	return (
		<Routes>
			<Route
				index
				element={
					<Navigate to={isAuthenticated ? PATHS.SALES.FINISHED_SALES : PATHS.LOGIN} replace />
				}
			/>
			<Route path={PATHS.ROOT} element={<RootLayout />}>
				{StocksRoutes({ isAuthenticated, userRole })}
				{SalesRoutes({ isAuthenticated, userRole })}
				{ReturnRoutes({ isAuthenticated, userRole })}
				{InventoryRoutes({ isAuthenticated, userRole })}
				{ReportsRoutes({ isAuthenticated, userRole })}
			</Route>
			<Route
				path="/"
				element={
					<Navigate to={isAuthenticated ? PATHS.SALES.FINISHED_SALES : PATHS.LOGIN} replace />
				}
			/>
			{PdfRoutes({ isAuthenticated, userRole })}

			<Route
				path={PATHS.LOGIN}
				element={
					isAuthenticated ? <Navigate to={PATHS.SALES.FINISHED_SALES} replace /> : <LoginScreen />
				}
			/>
			<Route path={PATHS.ERROR} element={<ErrorScreen />} />
			<Route path={PATHS.NOT_FOUND} element={<NotFoundScreen />} />
		</Routes>
	);
}
