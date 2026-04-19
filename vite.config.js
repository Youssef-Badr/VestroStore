import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";


export default defineConfig({
  plugins: [
    react(),
    imagetools() // ✅ إضافة معالجة الصور
  ],
  //  server: {
  //   host: true, // مهم مع ngrok
  //   allowedHosts: [
  //     "myrtle-columbous-fuzzily.ngrok-free.dev"
  //   ]
  // },
  
  
  build: {
    minify: 'esbuild', // أو 'terser'
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // كل الحزم الخارجية تروح في ملف vendor.js
          }
        }
      }
    },
    chunkSizeWarningLimit: 600 // لو عايز تزود الحد للتحذيرات
  }
});
