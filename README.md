# FitMatch Fullstack

Next.js 14 + Express 5 + SQLite 版本，依 `../Prompt.md` 由既有靜態頁遷移。

## Setup

```bash
cd Web_design1/fitmatch
corepack pnpm install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.local.example apps/web/.env.local
corepack pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Demo

- 學員：`0912000000` / `password123`
- 商家：`0999000000` / `password123`

第一次啟動 server 會建立 SQLite schema 並匯入 seed 資料。
