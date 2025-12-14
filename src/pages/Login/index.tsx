import { Image } from "antd";
import SimpleInput from "@/components/ui/SimpleInput";
import SimpleButton from "@/components/ui/SimpleButton";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LockKeyhole, LockKeyholeOpen, UserRound } from "lucide-react";
import useSendRequest from "@/hooks/useSubmitData";
import type { Login } from "@/types/api/Auth";
import { setCookie } from "@/lib/actions";
import Logo from "../../assets/logoBlue.jpg";

function LoginScreen() {
	const { t } = useTranslation();
	const { isSending, sendRequest } = useSendRequest();
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(true);

	const handleLogin = async () => {
		const data = {
			employeeCode: login,
			externalEmployeeNumber: password,
			deviceId: "string",
		};
		const result = await sendRequest<Login>({
			url: "/auth",
			method: "POST",
			data,
			showSuccessModal: false,
		});
		if (result.code !== 200) return;
		setCookie("access_token", result.data?.accessToken as string);
		setCookie("get_me", JSON.stringify(result.data));
		setCookie("job_title", result.data?.jobTitle?.toLowerCase() as string);
		window.location.href = "sales/finished-sales";
	};
	return (
		<div className="w-screen h-screen  flex items-center justify-center bg-primary-light">
			<form
				className="md:w-[535px] w-72 h-[350px] p-10 bg-white rounded-2xl z-10 flex flex-col gap-8 items-center border shadow-lg"
				onSubmit={(e) => {
					e.preventDefault();
					handleLogin();
				}}
			>
				<Image alt="munis logo" width={122} src={Logo} preview={false} />
				<div className="w-full flex flex-col gap-4">
					<SimpleInput
						value={login}
						onValueChange={(e) => setLogin(e)}
						placeholder={t("label.enter_login")}
						type="text"
						icon={<UserRound />}
						rounded="xl"
						disabled={isSending}
					/>
					<SimpleInput
						value={password}
						onValueChange={(e) => setPassword(e)}
						placeholder={t("label.enter_password")}
						type={showPassword ? "text" : "password"}
						icon={showPassword ? <LockKeyholeOpen /> : <LockKeyhole />}
						rounded="xl"
						disabled={isSending}
						onIconClick={() => setShowPassword(!showPassword)}
					/>
				</div>
				<SimpleButton
					onClick={handleLogin}
					type="primary"
					content={t("button.enter")}
					rounded="xl"
					loading={isSending}
				/>
			</form>
		</div>
	);
}

export default LoginScreen;
