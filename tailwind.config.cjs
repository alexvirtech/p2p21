module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
	theme: {
		extend: {
            outline: ['focus'],
            animation: {
                'slide-in': 'slide-in 0.2s ease-in-out',
                'slide-out': 'slide-out 0.2s ease-in-out',
            },
            keyframes: {
                'slide-in': {
                    '0%': { transform: 'translateX(-100%)' }, 
                    '100%': { transform: 'translateX(0)' },
                },
                'slide-out': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
            screens: { 
                'tiny': '280px', // => @media (min-width: 280px) { ... }
                'xxxs': '350px',
                'xxs': '400px',
                'smaller': '460px', // => @media (min-width: 460px) { ... }
                'small': '516px',
                'mobile': '696px',
                'sm-tablet': '850px', 
                'tablet': '1025px',
                'desktop': '1296px',
                'landscape': { 'raw': '(orientation: landscape)' },
                'portrait': { 'raw': '(orientation: portrait)' },
                'h700':{ 'raw': '(min-height: 700px)' }, // low screen height
                'low': { 'raw': '(min-height: 500px)' }, // low screen height
                'tablet-h': { 'raw': '(min-height: 730px)' }, // tablet height
                'tablet-wh': { 'raw': '(min-width: 1000px) and (min-height: 730px)' } // tablet width and height
            },
            gridTemplateColumns: {
                // Simple 18 column grid
                '18': 'repeat(18, minmax(0, 1fr))',
            },           
        },
	},
  plugins: [],
};
