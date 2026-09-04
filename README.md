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
