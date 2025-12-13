import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import formatNumber from "@/helpers/formatNumber";

const DashboardCard = ({
	title,
	icon,
	iconBgColor,
	price,
	priceColor,
}: {
	title: string;
	icon: React.ReactNode;
	iconBgColor: string;
	price: number;
	priceColor?: string;
}) => {
	return (
		<div
			className={` bg-gray-100 drop-shadow-2xl p-2 rounded-xl w-full min-h-32 cursor-pointer hover:scale-[1.02]	transition-all duration-300 ease-in-out `}
		>
			<div className="flex flex-col mt-2">
				<div className="flex items-center  gap-5">
					<div className={`${iconBgColor} rounded-xl p-3`}>{icon}</div>
					<h2 className="text-xl font-bold">{title}</h2>
				</div>
				<div className="flex flex-col items-start ml-2">
					<p className={`${priceColor || "text-blue-900"} font-bold text-lg mt-5`}>
						{formatNumber(price)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default DashboardCard;
