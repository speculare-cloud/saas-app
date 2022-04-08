const colors = require('tailwindcss/colors')

module.exports = {
	content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	variants: {},
	plugins: [require("daisyui")],
	theme: {
		extend: {
			colors: {
				green: colors.emerald,
			}
		},
	},
}