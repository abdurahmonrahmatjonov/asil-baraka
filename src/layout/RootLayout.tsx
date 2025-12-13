import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function RootLayout() {
	return (
		<section className="h-screen w-full overflow-hidden">
			<Navbar />
			<div className="flex h-[calc(100vh-56px)] w-full">
				<Sidebar />
				<main className="flex-1 overflow-auto bg-[#16171A1A] px-2">
					<Outlet />
				</main>
			</div>
		</section>
	);
}

export default RootLayout;
