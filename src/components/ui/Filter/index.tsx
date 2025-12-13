import React, { useState, useEffect } from "react";
import Button from "@components/ui/Button";
import { useTranslation } from "react-i18next";
import FilterIcon from "@/assets/icons/filterIcon";
import type { FilterProps } from "./types";
import Select from "../Select";
import AutoComplete from "../AutoComplete";
import { InputSearch } from "../Input";
import clsx from "clsx";
import { Input as AntInput } from "antd";

export default function Filter({
	onClick,
	filters: filterFromProps,
	className,
	showAddBtn = false,
	handleAddBtnClick = () => {},
	addBtnText = "filter.add",
}: FilterProps) {
	const { t } = useTranslation("");
	const [isActive, setIsActive] = useState(true);
	const [filters, setFilters] = useState<any>([]);

	useEffect(() => {
		setFilters(filterFromProps);
		console.log("filterFromProps", filterFromProps);
	}, [filterFromProps, isActive]);

	const handleClickFilterBtn = () => {
		if (onClick) {
			onClick();
		}
		setIsActive(!isActive);
	};
	const handleClickClearBtn = () => {
		if (onClick) {
			onClick();
		}
	};
	return (
		<div className={className}>
			<div className="flex items-center justify-between ">
				<div className="flex items-center gap-2 ">
					<Button
						onClick={handleClickFilterBtn}
						isActive={isActive}
						icon={<FilterIcon isActive={isActive} />}
					>
						{t("filter.filter")}
					</Button>
					<Button onClick={handleClickClearBtn} icon={<FilterIcon />} className="ml-2">
						{t("filter.clear_filter")}
					</Button>
				</div>
				{showAddBtn && (
					<Button
						onClick={handleAddBtnClick}
						className="bg-primary hover:!bg-red-400 hover:!text-white text-white "
						bgColorHover="bg-red-400"
						hasShadow={false}
					>
						{t(addBtnText)}
					</Button>
				)}
			</div>
			{isActive && (
				<div
					className="flex flex-wrap  items-end gap-5 my-5"
					style={isActive ? { display: "flex" } : { display: "none" }}
				>
					{filters?.map((filter: any, index: number) => {
						return (
							<div className="flex flex-col gap-1" key={index}>
								<span className="text-gray-800 text-sm text-wrap">{filter.title}</span>
								{filter.type === "select" && (
									<Select
										className={clsx("min-w-28", filter.className)}
										options={filter.options}
										placeholder={filter.placeholder}
										value={filter.value}
										onChange={filter.onChange}
										loading={filter.loading}
										disabled={filter.disabled}
										size={filter.size}
										mode={filter.selectType}
										allowClear
									/>
								)}
								{filter.type === "autocomplete" && (
									<AutoComplete
										className={clsx("min-w-28", filter.className)}
										options={filter.options}
										placeholder={filter.placeholder}
										value={filter.value}
										onSearch={filter.onSearch}
										onSelect={filter.onSelect}
										loading={filter.loading}
										disabled={filter.disabled}
										size={filter.size}
										allowClear
									/>
								)}
								{filter.type === "input" && (
									<InputSearch
										className={clsx("min-w-28", filter.className)}
										defaultValue={filter.value}
										value={filter.value}
										placeholder={filter.placeholder}
										onChange={filter.onChange}
										loading={filter.loading}
										disabled={filter.disabled}
										size={filter.size}
										allowClear
									/>
								)}
								{filter.type === "date" && (
									<AntInput
										className={clsx("min-w-28", filter.className)}
										defaultValue={filter.value}
										value={filter.value}
										onChange={filter.onChange}
										disabled={filter.disabled}
										size={filter.size}
										type="date"
										min={filter.minDate}
										max={filter.maxDate}
									/>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
