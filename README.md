# CleanLanka — Mini Hackathon Team 1

MERN stack waste management platform for Sri Lanka.

## Component 3 — Recycling & Disposal Guide

Search how to dispose of waste and find nearby recycling centres (MongoDB-backed). Separate from Component 2 schedules (`/schedule` = *when* collection happens).

### Features

- Waste guide search with suggestions and categories
- Detailed disposal instructions (prepare / do / don’t / FAQ)
- Geospatial nearby recycling centres (`2dsphere`)
- Leaflet map, open/closed status (Asia/Colombo), directions
- Favorites, center info reports
- Municipality admin CRUD + verification + analytics dashboard
- Recycler centre profile (`/recycler/center`)
- EN / සිංහල / தமிழ் UI chrome (i18next)
- Low-data mode (skip images / lazy map)

### Technology

| Layer | Stack |
|-------|--------|
| Client | React, Vite, React Router, Leaflet, i18next, Recharts |
| Server | Express, Mongoose, JWT, Helmet, rate limit |
| DB | MongoDB (Atlas compatible) |

Design uses the existing CleanLanka CSS system (not Tailwind). API client uses `fetch` helpers (not Axios).

## Setup

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` (or `MONGO_URI`) and `JWT_SECRET`.
2. Install:

```bash
npm run install-all
```

3. Seed recycling data (demo centres marked `isDemo: true`):

```bash
npm run seed:recycling
```

4. Run:

```bash
npm run dev
```

- Client: http://localhost:5173  
- Server: http://localhost:5000  

### Environment

**Server (`server/.env`)**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cleanlanka
CLIENT_URL=http://localhost:5173
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
```

Optional image CDN keys can be added later; guides store image URLs only.

**Client:** Vite proxies `/api` to the server. For production set `VITE_API_URL` if needed.

## Main routes

| Path | Role |
|------|------|
| `/recycling-guide` | Public guide home + search |
| `/recycling-guide/:id` | Guide detail |
| `/recycling-centers` | List + filters + geolocation |
| `/recycling-centers/map` | Map view |
| `/recycling-centers/:id` | Center detail |
| `/saved` | Citizen favorites |
| `/recycler/center` | Recycler profile |
| `/admin/recycling-dashboard` | Municipality analytics |
| `/admin/waste-guides` | Guide CRUD |
| `/admin/recycling-centers` | Center CRUD / verify |
| `/admin/center-reports` | Review citizen reports |

`/guide` redirects to `/recycling-guide`.

## API (Component 3)

**Waste guides**

- `GET /api/waste-guides`
- `GET /api/waste-guides/search?q=`
- `GET /api/waste-guides/suggest?q=`
- `GET /api/waste-guides/category/:category`
- `GET /api/waste-guides/:id`

**Centers**

- `GET /api/recycling-centers`
- `GET /api/recycling-centers/nearby?latitude=&longitude=&radius=&wasteType=`
- `GET /api/recycling-centers/:id`
- `POST /api/recycling-centers` (recycler)
- `PUT /api/recycling-centers/:id` (recycler owner)

**Favorites / reports**

- `GET|POST|DELETE /api/favorites/...`
- `POST /api/center-reports`

**Admin** (municipality JWT)

- `GET /api/admin/dashboard`
- CRUD `/api/admin/waste-guides`
- CRUD + verify `/api/admin/recycling-centers`
- `/api/admin/center-reports`

Responses: `{ success: true, data }` or `{ success: false, message }`.

## Testing

```bash
cd server
npm test
```

## Project layout (recycling)

```
server/models/recycling/
server/controllers/recycling/
server/routes/recycling/
server/services/recycling/
server/seed/seedRecycling.js
client/src/pages/Recycling*.jsx
client/src/pages/admin/*
client/src/components/recycling/
client/src/services/wasteGuideService.js
client/src/services/recyclingCenterService.js
```

## Important notes

- Demo recycling centres are labelled **not officially certified**.
- Geolocation is optional for browsing guides.
- Suspended centres are hidden from citizen search.
- Do not commit `.env` files.
