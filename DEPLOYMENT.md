# Production deployment guide

This project is ready for a split deployment:

- Frontend: Vercel
- Backend: Render or any Node.js host

## 1) Frontend on Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Set framework to Next.js.
4. Set environment variable:
   - NEXT_PUBLIC_API_URL=https://your-backend-url
5. Deploy.

## 2) Backend on Render

1. Create a new Web Service on Render.
2. Connect the same GitHub repo.
3. Use the root folder as the project root.
4. Set start command:
   - `node server/src/index.js`
5. Add environment variables:
   - PORT=4000
   - JWT_SECRET=your-secret
   - DATABASE_URL=postgresql://...
   - OPENAI_API_KEY=optional
6. Deploy.

## 3) Important notes

- The frontend must use the backend public URL, not localhost.
- The backend should accept CORS from the Vercel frontend domain.
- If `DATABASE_URL` is not configured, the app runs in demo mode.

## 4) Example final env values

Frontend:

```bash
NEXT_PUBLIC_API_URL=https://videolocalizer-api.onrender.com
```

Backend:

```bash
PORT=4000
JWT_SECRET=video-localizer-secret
DATABASE_URL=postgresql://postgres:postgres@host:5432/videolocalizer
OPENAI_API_KEY=
```
