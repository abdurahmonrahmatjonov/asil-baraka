import React, { useEffect, useState } from "react";
import "./main.css";
import "../index.css";
import formatNumber from "../../../helpers/formatNumber";
import type { SalesDataTypes } from "@/types/api/Sales";

const SalesPDF: React.FC = () => {
	const [data, setData] = useState<SalesDataTypes>(null);

	useEffect(() => {
		setTimeout(() => {
			window.print();
		}, 1000);
	}, []);

	useEffect(() => {
		const storedData = sessionStorage.getItem("orderPDFData");
		if (storedData) {
			setData(JSON.parse(storedData));
			const data: SalesDataTypes = JSON.parse(storedData);
			console.log("orderPDFData", data);
		}
	}, []);

	return (
		<div className="p-2 bg-white text-black font-sans">
			<div>
				{/* <p className="font-bold text-2xl text-center text-blue-600">
					OOO "MEGA AUTO PARTS SERVICE"
				</p> */}

				<div className="flex justify-between items-start gap-10 text-sm">
					<div className="flex flex-col gap-2">
						<span>Поставщик: СП «СOMFORT LUXURY GARDEN»</span>
						<span>Адрес: Ташкент, Шайх.р-н, ул. Бел Тепа,5</span>
						<span>Идентификационный номер поставщика (ИНН):303041604</span>
						<span>НДС : 326050033138</span>
					</div>
					<div className="flex gap-5 items-start">
						<div className="flex flex-col gap-2">
							<span>Покупатель : {data?.cardName}</span>
							<span>Дата : {data?.docDate}</span>
							<span>Регистрационный код плательщика</span>
							<span>НДС</span>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-6 mt-5">
				<table className="w-full border-collapse border border-black">
					<thead>
						<tr className=" text-black font-bold text-[15px]   print-bg-color">
							<th className="border border-black px-2 py-1">№</th>
							<th className="border border-black px-2 py-1">Наименование товаров</th>
							<th className="border border-black px-2 py-1">Ед. изм-ния</th>
							<th className="border border-black px-2 py-1">Заказ</th>
							<th className="border border-black px-2 py-1">Базовая цена</th>
							<th className="border border-black px-2 py-1">Цена для дилера</th>
							<th className="border border-black px-2 py-1">Сумма</th>
						</tr>
					</thead>
					<tbody>
						{data?.documentLines.map((item, idx) => {
							return (
								<tr className=" font-bold text-[12px]   print-bg-color">
									<td className="border border-black  px-2 py-1 text-center">{idx + 1}</td>
									<td className="border border-black  px-2 py-1">{item.itemDescription}</td>
									<td className="border text-center border-black  px-2 py-1">{item.ugpName}</td>
									<td className="border border-black  px-2 py-1 text-center">{item.quantity}</td>
									<td className="border border-black  px-2 py-1 text-center">{`${new Intl.NumberFormat(
										"fr-FR"
									).format(+item.itemPrice)} `}</td>
									<td className="border border-black  px-2 py-1 text-center">{`${new Intl.NumberFormat(
										"fr-FR"
									).format(+item.price)} `}</td>
									<td className="border border-black  px-2 py-1 text-center">{`${new Intl.NumberFormat(
										"fr-FR"
									).format(+item.price * +item.quantity)} `}</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr className=" text-black font-bold text-[12px]  print-bg-color">
							<td className="border border-black px-2 py-1 text-end font-semibold" colSpan={3}></td>
							<td className="border border-black px-2 py-1 text-center font-semibold" colSpan={1}>
								{new Intl.NumberFormat("fr-FR").format(
									data?.documentLines.reduce((total, item) => total + Number(item.quantity), 0)
								)}
							</td>
							<td className="border border-black px-2 py-1 text-center font-semibold" colSpan={1}>
								{new Intl.NumberFormat("fr-FR").format(
									data?.documentLines.reduce((total, item) => total + Number(item.itemPrice), 0)
								)}
							</td>
							<td className="border border-black px-2 py-1 text-center font-semibold" colSpan={1}>
								{new Intl.NumberFormat("fr-FR").format(
									data?.documentLines.reduce((total, item) => total + Number(item.price), 0)
								)}
							</td>
							<td className="border border-black px-2 py-1 text-center font-semibold" colSpan={1}>
								{new Intl.NumberFormat("fr-FR").format(
									data?.documentLines.reduce(
										(total, item) => total + Number(item.quantity) * Number(item.price),
										0
									)
								)}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div className="mt-8 ">
				<p className="mt-4 text-left font-bold">
					Всего к оплате: {data?.docTotal ? formatNumber(data.docTotal) : "0"}{" "}
					{data?.docCurrency ?? ""}
				</p>
				<div className="flex justify-between items-start gap-10 mt-14">
					<div className="text-center w-full">
						<div className="border-t border-gray-400 w-full mx-auto"></div>
						<p className="mt-2">Руководитель </p>
					</div>
					<div className="text-center w-full">
						<div className="border-t border-gray-400 w-full mx-auto"></div>
						<p className="mt-2">Получил</p>
					</div>
				</div>
				<div className="flex justify-between items-start gap-10 mt-14">
					<div className="text-center w-full">
						<div className="border-t border-gray-400 w-full mx-auto"></div>
						<p className="mt-2">Завсклад </p>
					</div>
					<div className="text-center w-full">
						<div className="border-t border-gray-400 w-full mx-auto"></div>
						<p className="mt-2">Товар отпустил</p>
					</div>
					<div className="text-center w-full">
						<div className="border-t border-gray-400 w-full mx-auto"></div>
						<p className="mt-2">Одобренно</p>
					</div>
				</div>
				<div className="text-start w-1/2 mt-14">
					<div className="border-t border-gray-400 w-full mx-auto"></div>
					<p className="mt-2 flex items-center justify-center">М.П (при наличии печати)</p>
				</div>
			</div>
		</div>
	);
};

export default SalesPDF;
