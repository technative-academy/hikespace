# HikeSpace

HikeSpace is a full-stack social app for sharing hiking routes, photos, and trail stories.

Users can create route-based posts, view hiking paths on interactive maps, and explore content from other hikers in a feed-style interface.

## Live Project

- Frontend: https://hikespace.vercel.app/
- Backend: https://hikespace-production.up.railway.app
- API docs: https://hikespace-production.up.railway.app/docs

## CV-Style Project Summary

**Role:** Full-stack developer project  
**Type:** Portfolio/social platform  
**Domain:** Outdoor/hiking community

### What This App Demonstrates

- Built a TypeScript-first full-stack app with React + Express.
- Designed modular backend architecture (router/controller/service/repository).
- Implemented relational data modeling with PostgreSQL + Drizzle ORM.
- Integrated authentication with Better Auth.
- Implemented map-based route visualization using React Leaflet + OpenStreetMap.
- Added image upload workflow support (Multer + S3-compatible storage config).
- Exposed OpenAPI/Swagger documentation for backend endpoints.

## Core Features

- User authentication (email/password via Better Auth).
- Post creation and management (create/read/update/delete).
- Route-based posts with geospatial trail data (`LineString`, EPSG:4326).
- Interactive map rendering for posts and route previewing.
- Image attachments linked to posts.
- Social interactions:
  - Likes
  - Follows
  - Participation tagging
- User profile/content views and feed pages.

## Tech Stack

### Frontend

- React 19 + TypeScript
- Vite 7
- React Router 7
- SWR (data fetching/caching)
- Tailwind CSS 4 + shadcn/base-ui components
- React Leaflet + Leaflet
- Sonner + Lucide React

### Backend

- Node.js + Express 5 + TypeScript
- PostgreSQL
- Drizzle ORM + Drizzle Kit (migrations/generation)
- Better Auth + Drizzle adapter
- Zod + zod-openapi + Swagger UI
- Multer (multipart uploads)
- AWS SDK S3 client/presigner (S3-compatible storage integration)
- Pino + pino-http (structured logging)

### DevOps / Hosting

- Frontend deployed on Vercel
- Backend deployed on Railway

## Project Structure

```text
hikespace/
  frontend/   # React client app
  backend/    # Express API + DB layer
```

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL instance

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

Set required values in `.env`:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `SWAGGER_URL`
- `BACK_BLAZE_KEY`
- `BACK_BLAZE_KEY_ID`
- `BACK_BLAZE_BUCKET_URL`
- `BACK_BLAZE_BUCKET_NAME`

Run migrations and start dev server:

```bash
npm run migrate
npm run dev
```

Backend runs on `http://localhost:3000` by default.

### 2) Frontend

```bash
cd frontend
npm install
```

Create `.env` in `frontend/`:

```env
API_BASE_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

## Useful Scripts

### Backend

- `npm run dev` - start API in watch mode
- `npm run build` - compile TypeScript
- `npm run generate` - generate Drizzle migration files
- `npm run migrate` - apply database migrations
- `npm run type-check` - run TypeScript type checks

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - build production assets
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

## API Overview

Main route groups:

- `/api/auth/*` (auth handler)
- `/users`
- `/posts`
- `/participations`
- `/images`
- `/likes`
- `/follows`

OpenAPI spec endpoint: `/openapi.json`
