/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./public/index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				teal: '#0077b6',
			},
		},
	},
	plugins: [],
};

