# CivicLens

CivicLens is a full-stack civic issue and local news platform where users can post incidents, discuss updates, and view AI-assisted credibility insights.

## Repository Structure

- `Website/` - Next.js 14 frontend (TypeScript + Tailwind)
- `backend/` - Node.js + Express API with MongoDB

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- Leaflet / React Leaflet

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT auth (cookie-based)
- Joi validation
- Cloudinary (media uploads)
- Groq API (AI credibility service)

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas)

## Quick Start

### 1) Clone and install dependencies

```bash
git clone https://github.com/Va09joshi/Civic_Lens.git
cd CivicLens

cd backend
npm install

cd ../Website
npm install
```

### 2) Configure environment variables

Create the required env files:

- `backend/.env`
- `Website/.env.local`

Add your project-specific values (database URL, JWT secret, API URLs, Cloudinary keys, Groq key, etc.).

### 3) Run in development

Open two terminals from the repository root.

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd Website
npm run dev
```

Default local URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Scripts

### Backend (`backend/package.json`)

- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in production mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix lint issues
- `npm run seed` - Run seed script

### Frontend (`Website/package.json`)

- `npm run dev` - Start Next.js development server
- `npm run build` - Build production app
- `npm start` - Start production server
- `npm run lint` - Run Next.js linting

## Notes

- `node_modules` is intentionally gitignored and should never be committed.
- If dependencies are missing after clone, run `npm install` inside both `backend/` and `Website/`.

## Deployment

Recommended setup:

- Frontend: Vercel (Next.js)
- Backend: Render/Railway/EC2/Docker
- Database: MongoDB Atlas

Ensure CORS and environment variables are correctly configured for production domains.

## Contributing

1. Create a feature branch
2. Make changes with clear commits
3. Open a pull request

## License

MIT
