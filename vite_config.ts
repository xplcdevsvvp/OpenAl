import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
// (1) Import plugin
import { viteSingleFile } from "vite-plugin-singlefile"; // <--- DÒNG ĐÃ THÊM

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    // (2) Thêm plugin vào mảng
    viteSingleFile(), // <--- DÒNG ĐÃ THÊM
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // (3) CẤU HÌNH QUAN TRỌNG ĐỂ GỘP FILE:
    cssCodeSplit: false, // <--- BẮT BUỘC: Ngăn Vite tách CSS (Tailwind) thành file riêng
    assetsInlineLimit: 100000000, // <--- BẮT BUỘC: Tăng giới hạn nhúng để bao gồm cả các asset lớn hơn
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
