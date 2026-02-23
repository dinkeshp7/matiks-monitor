# Matiks Monitor Frontend

Production-grade Next.js 14 dashboard for brand intelligence analytics.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN-style UI components
- Recharts
- Axios
- Framer Motion
- TanStack Query

## Setup

```bash
npm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` (default: `http://127.0.0.1:8000`).

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Default Login

Use the credentials configured in your FastAPI backend (typically `admin` / your password).
