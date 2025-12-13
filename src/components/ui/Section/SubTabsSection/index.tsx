import { ConfigProvider, Tabs } from "antd";
import { lightTheme } from "./theme";
import type { SubTab, SubTabsSectionProps } from "../types";
import clsx from "clsx";

export default function SubTabs({ subTabs, className = "" }: SubTabsSectionProps) {
	return (
		<ConfigProvider theme={lightTheme}>
			<Tabs
				type="card"
				size={"small"}
				style={{ padding: "0px", margin: "0px" }}
				items={subTabs?.map((tab: SubTab, index: number) => ({
					label: tab.name,
					key: index.toString(),
					children: tab.children,
				}))}
				className={clsx("rounded-lg p-0 shadow-md", className)}
			/>
		</ConfigProvider>
	);
}
