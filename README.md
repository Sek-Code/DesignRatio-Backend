# DesignRatio Backend (Express)

Backend API built with **Node.js + Express**.

## Prerequisites

- Node.js **20.x** (recommended because `package.json` sets `"engines": { "node": "20.x" }`)
- npm (comes with Node)
- (Optional) MongoDB if you plan to use database features

## Setup (step-by-step)

### 1) Clone & enter project

```bash
git clone <your-repo-url>
cd DesignRatio-Backend
```

### 2) Use Node 20 (via nvm)

If you have `nvm` installed:

```bash
nvm install 20
nvm use 20
node -v
```

Expected: `v20.x.x`

> If `node -v` still shows a different version, close/reopen your terminal and try `nvm use 20` again.

### 3) Install dependencies

```bash
npm install
```

### 4) Create your environment file

This repo ignores `.env` by default (so secrets won’t be committed).

```bash
cp .env.example .env
```

Edit `.env` values as needed.

### 5) Run the server

Development (watch mode):

```bash
npm run dev
```

Production-like start:

```bash
npm start
```

## Testing

Run tests:

```bash
npm test
```

Coverage:

```bash
npm run coverage
```

## Notes

- `node_modules/` is ignored via `.gitignore`.
- `.env` and `.env.*` are ignored, while `.env.example` is committed as a template..
