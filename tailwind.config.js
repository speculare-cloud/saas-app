const colors = require('tailwindcss/colors')

module.exports = {
	content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	variants: {},
	daisyui: {
		themes: [{
			speculare: {
				"primary": "#2ff9d1",
				"secondary": "#63f9cf",
				"accent": "#e293e2",
				"neutral": "#202328",
				"base-100": "#2C333F",
				"info": "#87B0EE",
				"success": "#61E0C9",
				"warning": "#A67A03",
				"error": "#F37359",
			},
		}, ],
	},
	plugins: [require("daisyui")],
	theme: {
		extend: {
			colors: {
				green: colors.emerald,
			}
		},
	},
}