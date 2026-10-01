# GUILD WAR

Dua folder, dua-duanya berdiri sendiri:

```
server/   API Express + Supabase (login admin)
client/   Web React (Vite)
```

## Server

```bash
cd server
npm install
cp .env.example .env      # isi SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY
npm run create-admin      # sekali aja, bikin akun admin
npm run dev               # http://localhost:4000
```

Kalau tabel belum dibuat: jalankan `server/src/db/schema.sql` di Supabase SQL Editor.

## Client

```bash
cd client
npm install
cp .env.example .env      # isi VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE
npm run dev               # http://localhost:5173
```

Jalankan server dan client di dua terminal berbeda.

tessss
