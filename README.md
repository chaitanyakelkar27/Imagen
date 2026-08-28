# Imagen

Imagen is a full-stack AI image generation web application that lets users transform text prompts into stunning visuals using the Clipdrop API. It is built with a modern React frontend and a robust Node.js/Express backend, featuring a complete SaaS-style architecture with authentication, credits, galleries, and more.

## ✨ Key Features

- **🎨 AI Image Generation** — Converts text prompts into high-quality images using the Clipdrop API
- **🔐 Multi-Method Authentication** — Email/password (JWT) and Google OAuth sign-in
- **🔑 Password Reset** — Forgot password flow with secure token-based reset emails via Gmail SMTP
- **🖼️ Personal Gallery** — View, search, filter, sort and manage all generated images
- **❤️ Favorites** — Bookmark preferred images for quick access
- **📊 Creative Stats Dashboard** — Real-time overview of total generations, favorites count, and top categories used
- **💳 Credit System** — Users start with 5 free credits; each generation costs 1 credit with the ability to purchase more
- **🛡️ Smart Demo Mode** — When API quota is exhausted, automatically falls back to curated Unsplash images so the app stays functional
- **📱 Responsive UI** — Clean, minimal design that works on desktop and mobile

## 🌐 Live Demo

- **Frontend**: [https://imagen-chai.vercel.app](https://imagen-chai.vercel.app)
- **Backend API**: [https://imagen-csk.vercel.app](https://imagen-csk.vercel.app)

## 🏗️ Technical Architecture

### Frontend
- **Core**: React 18, Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **State & Networking**: Axios, React Context API
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: Passport.js (Google OAuth), JWT, Bcrypt
- **Email**: Nodemailer (Gmail SMTP) for password reset emails
- **Image Generation**: Clipdrop API

### Infrastructure
- **Deployment**: Vercel (Client + Server as separate projects)
- **Containerization**: Docker + Docker Compose (dev & production configs)

## 📁 Project Structure

```
Imagen/
├── client/                  # React frontend (Vite)
│   ├── public/              # Static public files
│   ├── src/
│   │   ├── assets/          # Images, icons, SVGs, assets.js
│   │   ├── components/      # Reusable UI (Navbar, Footer, Login, etc.)
│   │   ├── context/         # React Context (AppContext)
│   │   └── pages/           # Page components (Home, Gallery, Result, etc.)
│   ├── index.html
│   ├── vercel.json
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── config/              # DB connection, Passport config
│   ├── controllers/         # Route handlers (user, image)
│   ├── middlewares/         # Auth middleware, rate limiter
│   ├── models/              # Mongoose schemas (User, Image)
│   ├── routes/              # API route definitions
│   ├── server.js            # App entry point
│   ├── Dockerfile           # Production Docker image
│   ├── Dockerfile.dev       # Dev Docker image (nodemon)
│   └── vercel.json          # Vercel serverless config
│
├── docker-compose.yml       # Production Docker Compose
├── docker-compose.dev.yml   # Dev Docker Compose
├── .env.example             # Environment variable template
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Clipdrop API key
- Google OAuth credentials (Client ID & Secret)
- Gmail account with App Password (for password reset emails)

### 1. Clone the Repository

```bash
git clone https://github.com/chaitanyakelkar27/Imagen.git
cd Imagen
```

### 2. Configure Environment Variables

Copy `.env.example` and fill in your values:

```bash
# Server — create server/.env
cp .env.example server/.env
```

**Required variables for `server/.env`:**

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/imagen

JWT_SECRET=your_strong_jwt_secret
SESSION_SECRET=your_session_secret

SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIPDROP_API=your_clipdrop_api_key

# Gmail SMTP for password reset emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
```

**Required variable for `client/.env`:**

```env
VITE_BACKEND_URL=http://localhost:5000
```

> **How to get a Gmail App Password:**
> Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), enable 2-Step Verification, create an App Password, and use the 16-character code as `SMTP_PASS`.

### 3. Install Dependencies & Run

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend** (new terminal):
```bash
cd client
npm install
npm run dev
```

App will be available at `http://localhost:5173`

## 📡 API Reference

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/register` | Register a new account |
| `POST` | `/api/user/login` | Login with email & password |
| `GET` | `/api/user/google` | Start Google OAuth |
| `GET` | `/api/user/google/callback` | Google OAuth callback |
| `POST` | `/api/user/credits` | Get current credit balance |
| `POST` | `/api/user/pay-credits` | Simulate credit purchase |
| `POST` | `/api/user/forgot-password` | Send password reset email |
| `POST` | `/api/user/reset-password` | Set new password via token |

### Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/image/generate-image` | Generate a new image |
| `GET` | `/api/image/user-images` | Get paginated user images |
| `DELETE` | `/api/image/delete-image/:id` | Delete a specific image |
| `DELETE` | `/api/image/delete-multiple` | Batch delete images |
| `PATCH` | `/api/image/toggle-favorite/:id` | Toggle favorite status |
| `GET` | `/api/image/stats` | Get user stats (totals, categories) |

## ☁️ Deployment (Vercel)

This project deploys as two separate Vercel projects from the same GitHub repository.

### Backend (`server/`)

1. Import the repository into a new Vercel project
2. Set **Root Directory** to `server`
3. Add all environment variables from `server/.env` in **Project Settings → Environment Variables**:
   - `MONGODB_URI`, `JWT_SECRET`, `SESSION_SECRET`
   - `CORS_ORIGIN`, `SERVER_URL`, `CLIENT_URL`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `CLIPDROP_API`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
4. Deploy

### Frontend (`client/`)

1. Import the same repository into another Vercel project
2. Set **Root Directory** to `client`
3. Add environment variable:
   - `VITE_BACKEND_URL` = your deployed backend URL (e.g., `https://imagen-csk.vercel.app`)
4. Deploy

## 🔧 Notable Challenges Solved

### 1. Authentication Security
Implemented proper validation and error messages that protect against account enumeration while still being helpful to legitimate users.

### 2. API Quota Graceful Degradation
When the Clipdrop API quota is exhausted, the server automatically switches to demo mode and serves curated Unsplash images with a notification, keeping the app fully functional.

### 3. Password Reset for OAuth Users
The forgot-password endpoint classifies users by `authProvider` field — Google OAuth users are redirected to "Continue with Google" instead of receiving a confusing email reset link.

### 4. Docker Multi-Container Setup
Separate Dockerfile configs for dev (Vite HMR + nodemon) and production (Nginx + Node). Docker Compose orchestrates all three services (client, server, MongoDB) with health checks and proper networking.

### 5. Duplicate File & Asset Cleanup
Removed boilerplate Vite template files, duplicate SVG assets, and consolidated three `.env.example` files into a single root-level template.

## 🐳 Docker (Optional)

Run the full stack locally with Docker:

```bash
# Development (with hot reload)
docker-compose -f docker-compose.dev.yml up

# Production build
docker-compose up --build
```

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Chaitanya Kelkar**

## 🙏 Acknowledgments

- [Clipdrop API](https://clipdrop.co/apis) — AI image generation
- [Unsplash](https://unsplash.com) — Demo fallback images
- [Vercel](https://vercel.com) — Hosting

---

⭐ Star this repo if you found it helpful!
