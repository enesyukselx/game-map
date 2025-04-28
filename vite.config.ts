/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        // globals: true,
        // environment: "jsdom",
        // setupFiles: "./src/setupTests.ts",
        coverage: {
            reporter: ["text", "json", "html"],
            all: true,
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.test.{ts,tsx}"],
        },
    },
});
