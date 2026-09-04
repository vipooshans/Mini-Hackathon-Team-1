# Mini Hackathon Team 1

MERN stack (MongoDB, Express, React, Node.js).

```
├── client/                 # React (Vite)
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── utils/
└── server/                 # Express + MongoDB
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

## Setup

1. Copy `.env.example` to `server/.env` and set your MongoDB URI.
2. Install dependencies:

```bash
npm run install-all
```

3. Start MongoDB locally, then run both apps:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

## Collection Schedule Lookup

Citizens select a municipal council, district, and area or ward. The application searches MongoDB and displays the next pickup schedule. The optional reminder setting is stored only in the browser using `localStorage`.

- Endpoint: `GET /api/collection-schedules/lookup`
- Seed demo schedules: `npm run seed:collection-schedules --prefix server`
- Frontend environment: `VITE_API_URL=/api` (optional; this is the default)
- Backend environment: `MONGODB_URI` is required in `server/.env`; `PORT` and `CLIENT_URL` are optional.

Collection schedule records included with this project are sample/demo data and are not official municipal schedules.
