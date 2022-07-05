module.exports = {
	content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	variants: {},
	daisyui: {
		themes: [{
			custom: {
				...require("daisyui/src/colors/themes")["[data-theme=black]"],
				"base-100": "#1e1b1b",
				"base-300": "#121212",
				"neutral-focus": "#383838",
				"info": "#3b82f6",
				"warning": "#e1e16f",
				"error": "#d96f6f",
				"success": "#71c76b",
				"--rounded-box": "0.5rem",
				"--rounded-btn": "0.5rem",
				"--rounded-badge": "1.9rem",
			},
		},],
	},
	plugins: [
		require('tailwindcss/colors'),
		require('@tailwindcss/typography'),
		require("daisyui")
	],
}