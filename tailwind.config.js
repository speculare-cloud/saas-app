module.exports = {
	content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	variants: {},
	plugins: [
		require('tailwindcss/colors'),
		require('@tailwindcss/typography'),
		require("daisyui")
	],
}