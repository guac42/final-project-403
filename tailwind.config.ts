import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,tsx}", "!./db"],
};

export default config;