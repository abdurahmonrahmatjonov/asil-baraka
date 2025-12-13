import axios from "axios";
import { getCookie, removeCookies } from "../lib/actions";

const api = axios.create({
	baseURL:
		window.location.hostname.includes("test") || window.location.hostname.includes("localhost")
			? import.meta.env.VITE_BASE_URL_TEST
			: import.meta.env.VITE_BASE_URL,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

let isRefreshing = false;

api.interceptors.request.use(
	(config) => {
		const access_token = getCookie("access_token");
		if (access_token) {
			config.headers.Authorization = `Bearer ${access_token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 && !isRefreshing) {
			isRefreshing = true;
			removeCookies();
			console.error("Unauthorized! Redirecting to login...");
			window.location.assign("/login");
		}
		return Promise.reject(error);
	}
);

export default api;
