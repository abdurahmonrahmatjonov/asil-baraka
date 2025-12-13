import type { SectionProps } from "./types";
import Filter from "../Filter";
import Button from "../Button";
import Table from "../Table";
import Select from "@/components/ui/Select";

function Section({
	onClearFilters = () => {},
	filters = [],
	data = [],
	columns = [],
	loading = false,
	showAddBtn = false,
	handleAddBtnClick = () => {},
	addBtnText = "filter.add",
	rowClassName = () => "",
	scrollTable = {},
	isShowPaginationBtn = true,
	handleNextPage = () => {},
	handlePrevPage = () => {},
	currentPage = 1,
	isNextPageDisabled = false,
	isPrevPageDisabled = false,
	isShowPageSize = false,
	handlePageSizeChange = () => {},
	pageSize = 10,
}: SectionProps) {
	return (
		<div className="w-full  px-2 pt-3 rounded-lg rounded-tl-none  bg-white  shadow-md">
			<Filter
				filters={filters}
				onClick={onClearFilters}
				showAddBtn={showAddBtn}
				handleAddBtnClick={handleAddBtnClick}
				addBtnText={addBtnText}
			/>
			<div className="mt-5 flex  items-end justify-end gap-10">
				{isShowPageSize && (
					<div className="flex flex-col items-start gap-2 justify-end ">
						<Select
							onChange={handlePageSizeChange}
							value={pageSize}
							className="w-[100px]"
							options={[10, 20, 30, 40, 50, 100].map((v) => ({ label: `${v} / page`, value: v }))}
						/>
					</div>
				)}
				{isShowPaginationBtn && (
					<div className="flex items-center justify-end ">
						<Button
							onClick={handlePrevPage}
							className=" bg-primary h-8 text-white  hover:!bg-red-400"
							disabled={currentPage === 1 || isPrevPageDisabled}
							hasShadow={false}
						>
							{"<"}
						</Button>
						<span className="mx-2">{currentPage}</span>
						<Button
							onClick={handleNextPage}
							className=" bg-primary  h-8 text-white  hover:!bg-red-400"
							disabled={isNextPageDisabled}
							hasShadow={false}
						>
							{">"}
						</Button>
					</div>
				)}
			</div>
			<div className="my-5">
				<Table
					columns={columns}
					data={data}
					loading={loading}
					scroll={scrollTable}
					rowClassName={rowClassName}
				/>
			</div>
		</div>
	);
}

export default Section;
