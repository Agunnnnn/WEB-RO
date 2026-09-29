// Entry point khusus Vercel Serverless Function.
// Vercel butuh file di folder /api yang nge-export Express app-nya
// (bukan app.listen() kayak src/index.js yang dipakai buat dev lokal).
import { createApp } from "../src/app.js";

const app = createApp();

export default app;
