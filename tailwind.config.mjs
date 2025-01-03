// tailwind.config.cjs
module.exports = {
	content: [
		'./src/**/*.{astro,html,js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				blue: {
					100: '#ebf8ff',
					200: '#bee3f8',
					300: '#90cdf4',
					400: '#63b3ed',
					500: '#4299e1',
					600: '#3182ce',
					700: '#2b6cb0',
					800: '#2c5282',
					900: '#2a4365',
				},
			},
		},
	},
	plugins: [],
}
