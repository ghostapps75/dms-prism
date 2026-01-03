/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark-slate': '#0f172a',
                'neon-purple': '#d946ef', // Fuchsia 500ish, nice and neon
                'retro-green': '#4ade80', // Green 400, bright
            },
            fontFamily: {
                'arcade': ['"Press Start 2P"', 'cursive'],
                'sans': ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon': '0 0 5px theme("colors.neon-purple"), 0 0 10px theme("colors.neon-purple")',
                'retro': '4px 4px 0px 0px rgba(0,0,0,0.5)',
            },
        },
    },
    plugins: [],
}
