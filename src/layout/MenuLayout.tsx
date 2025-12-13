import MenuTab from "@/components/ui/MenuTab";
import { Outlet } from "react-router-dom";

export default function MenuLayout({
	tabs = [],
}: {
	tabs?: {
		name: string;
		path: string;
	}[];
}) {
	if (!tabs || tabs.length === 0) {
		return (
			<div className="flex flex-col gap-4 w-full px-4 pt-4">
				<Outlet />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 w-full px-4 pt-4">
			<div className="w-full rounded-xl shadow-md shadow-gray-400 px-4 flex items-center gap-2 bg-white py-0.5">
				{tabs.map((tab) => (
					<MenuTab name={tab.name} path={tab.path} key={tab.path} />
				))}
			</div>
			<Outlet />
		</div>
	);
}
