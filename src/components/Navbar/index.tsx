import { Dropdown, Image, Space, type MenuProps } from "antd";
import Avatar from "/images/avatar.png";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { getCookie, removeCookies } from "@/lib/actions";
import Logo from "@assets/logo.jpg";
const items: MenuProps["items"] = [
	{
		label: (
			<a
				onClick={() => {
					removeCookies();
					window.location.href = "/login";
				}}
			>
				Log out
			</a>
		),
		key: "0",
	},
];

export default function Navbar() {
	const { i18n } = useTranslation();

	const getMe = getCookie("get_me");

	const [lang, setLang] = useState<"uz" | "ru">(
		(localStorage.getItem("lang") as "uz" | "ru") || "uz"
	);

	const handleLangChange = (lang: "uz" | "ru") => {
		localStorage.setItem("lang", lang);
		i18n.changeLanguage(lang);
		setLang(lang);
	};

	return (
		<div className="w-full   h-14 bg-black flex items-center justify-between px-4 py-2">
			<Image alt="munis logo" width={140} src={Logo} preview={false} />
			<div className="flex items-center justify-center gap-8">
				<div className="flex items-center justify-between p-0.5 rounded-xl gap-1 bg-gray-700 w-32 h-9 relative">
					{/* Sliding background indicator */}
					<div
						className={clsx(
							"absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white rounded-xl transition-transform duration-300 ease-out",
							lang === "uz" ? "translate-x-0" : "translate-x-[calc(100%+4px)]"
						)}
					/>

					<button
						className={clsx(
							"rounded-xl h-8 flex-1 font-semibold relative z-10 transition-colors duration-300 ease-out transform",
							lang === "uz" ? "text-gray-950" : "text-white hover:text-gray-200"
						)}
						onClick={() => handleLangChange("uz")}
					>
						O'zb
					</button>
					<button
						className={clsx(
							"rounded-xl h-8 flex-1 font-semibold relative z-10 transition-colors duration-300 ease-out transform",
							lang === "ru" ? "text-gray-950" : "text-white hover:text-gray-200"
						)}
						onClick={() => handleLangChange("ru")}
					>
						Рус
					</button>
				</div>
				<div className="flex items-center justify-center gap-2 cursor-pointer">
					<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
						{getMe?.firstName[0]}
					</div>
					<Dropdown menu={{ items }} trigger={["click"]}>
						<a onClick={(e) => e.preventDefault()}>
							<Space className="text-white text-sm">
								{`${getMe?.firstName} ${getMe?.lastName}`}
								<ChevronDown />
							</Space>
						</a>
					</Dropdown>
				</div>
			</div>
		</div>
	);
}
