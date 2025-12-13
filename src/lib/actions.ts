import cookies from "js-cookie";

type CookieType = "job_title" | "access_token" | "get_me" | "user_role";

export function setCookie(key: CookieType, value: string) {
	cookies.set(key, value, {
		httpOnly: false,
		secure: true,
		expires: 24,
	});
}

export function getCookie(key: CookieType) {
	const value = cookies.get(key);
	if (key === "get_me") {
		return JSON.parse(value || "{}");
	}
	return value;
}

export function removeCookies() {
	cookies.remove("access_token");
	cookies.remove("job_title");
	cookies.remove("get_me");
}
