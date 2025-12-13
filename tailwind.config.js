/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#CF0920", // red-600
				"primary-light": "#CF09200F", // red-600/10
				secondary: "#0A4D68", //sky-900
				"secondary-hover": "#0A4D80", // sky-900/10
			},
		},
	},
	plugins: [],
};
