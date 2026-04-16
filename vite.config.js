import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-oxc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // <--- ADD THIS LINE HERE
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    sourcemap: true,
  },
});