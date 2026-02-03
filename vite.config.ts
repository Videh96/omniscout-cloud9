import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Manually try to read .env.local to ensure keys are loaded
  const envPath = path.resolve(process.cwd(), '.env.local');
  const localEnv: Record<string, string> = {};

  try {
    if (fs.existsSync(envPath)) {
      console.log(`[Vite] Manual Load: Found .env.local at ${envPath}`);
      const fileContent = fs.readFileSync(envPath, 'utf-8');
      fileContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim();
          if (key && val) localEnv[key] = val;
        }
      });
    }
  } catch (err) {
    console.warn("[Vite] Failed to manually parse .env.local", err);
  }

  // 2. Use standard Vite loadEnv (prioritizes .env.local by default)
  const env = loadEnv(mode, process.cwd(), '');

  // 3. Resolve Keys: Manual Load -> Vite Load -> Fallback (Hardcoded for debugging/submission stability if needed)
  // Ideally, rely on .env, but for the hackathon "make it work", we ensure values exist.
  const GRID_KEY = localEnv['VITE_GRID_API_KEY'] || env.VITE_GRID_API_KEY || "";
  const GROQ_KEY = localEnv['VITE_GROQ_API_KEY'] || env.VITE_GROQ_API_KEY || "";

  console.log(`[Vite] Configured GRID Key: ${GRID_KEY ? 'Present' : 'Missing'}`);
  console.log(`[Vite] Configured GROQ Key: ${GROQ_KEY ? 'Present' : 'Missing'}`);

  return {
    plugins: [react()],
    define: {
      // Define these globally so they are replaced at build time with the string values
      'process.env.VITE_GRID_API_KEY': JSON.stringify(GRID_KEY),
      'process.env.VITE_GROQ_API_KEY': JSON.stringify(GROQ_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      host: true, // Listen on all addresses
    },
  };
});