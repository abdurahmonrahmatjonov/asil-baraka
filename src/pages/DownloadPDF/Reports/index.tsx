import React, { useEffect, useState } from "react";
import "./main.css";
import "../index.css";
import type { ReportsResDataTypes } from "@/types/api/Reports";
import formatNumber from "@/helpers/formatNumber";

const ReportsPDF: React.FC = () => {
	const [data, setData] = useState<ReportsResDataTypes[]>([]);

	useEffect(() => {
		setTimeout(() => {
			window.print();
		}, 1000);
	}, []);

	useEffect(() => {
		const storedData = sessionStorage.getItem("reportsPDFData");
		if (storedData) {
			setData(JSON.parse(storedData));
			const data: ReportsResDataTypes = JSON.parse(storedData);
			console.log("reportsPDFData", data);
		}
	}, []);

	return (
		<div className="p-2 bg-white text-black font-sans">
			<div className="mb-6 mt-5">
				<table className="w-full border-collapse border border-black">
					<thead>
						<tr className=" text-black font-bold text-[15px]   print-bg-color">
							<th className="border border-black px-2 py-1">№</th>
							<th className="border border-black px-2 py-1">Tovar</th>
							<th className="border border-black px-2 py-1">Oy boshi</th>
							<th className="border border-black px-2 py-1">Prixod</th>
							<th className="border border-black px-2 py-1">Rasxod</th>
							<th className="border border-black px-2 py-1">Vozvrat</th>
							<th className="border border-black px-2 py-1">Fakt</th>
							<th className="border border-black px-2 py-1">O'lchov birligi</th>
						</tr>
					</thead>
					<tbody>
						{data?.map((item, idx) => {
							return (
								<tr className=" font-bold text-[12px]   print-bg-color">
									<td className="border border-black  px-2 py-1 text-center">{idx + 1}</td>
									<td className="border border-black  px-2 py-1">{item.itemName}</td>
									<td className="border text-center border-black  px-2 py-1">
										{item.initialBalance}
									</td>
									<td className="border border-black  px-2 py-1 text-center">
										{formatNumber(item.incomingQty)}
									</td>
									<td className="border border-black  px-2 py-1 text-center">
										{formatNumber(item.outgoingQty)}
									</td>
									<td className="border border-black  px-2 py-1 text-center">
										{formatNumber(item.returnedQty)}
									</td>
									<td className="border border-black  px-2 py-1 text-center">
										{formatNumber(item.fakt)}
									</td>
									<td className="border border-black  px-2 py-1 text-center">{item.itmsGrpNam}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ReportsPDF;
