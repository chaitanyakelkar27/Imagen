# Imagen

Imagen is a full-stack web application that enables users to generate high-quality images from text prompts. It leverages the Clipdrop API for generation and creates a seamless experience with a modern React frontend and a robust Node.js/Express backend.

This project demonstrates a complete SaaS-like architecture, featuring user authentication, credit management, image galleries, and a fallback demo mode that ensures the application remains usable even when API quotas are reached.

## Key Features

- **AI-Powered Generation** - Converts natural language text prompts into images using the Clipdrop API

- **Authentication System** - Secure user access via email/password (JWT) and Google OAuth integration

- **Personal Gallery** - Users can view, manage, and organize their generated history

- **Search and Filter** - Includes capabilities to search images by prompt, filter by category, and sort by creation date

- **Favorites** - Users can bookmark their preferred generations for quick access

- **Credit System** - A simulated economy where users consume credits to generate images and can "purchase" more via a demo payment flow

- **Smart Demo Mode** - If the backend detects that the API quota is exhausted, the system automatically switches to a demo mode, serving curated images from Unsplash to maintain functionality

- **Responsive UI** - A monochrome, professional interface designed for both desktop and mobile use

## Live Demo

You can explore the live application here:

- **Frontend Application**: [https://imagen-chai.vercel.app](https://imagen-chai.vercel.app)
- **Backend API**: [https://imagen-csk.vercel.app](https://imagen-csk.vercel.app)

## Technical Architecture

### Frontend
- **Core**: React 18, Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **State & Networking**: Axios, React Context API
- **Utilities**: React Toastify for notifications

### Backend
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: Passport.js (Google Strategy), JWT, Bcrypt
- **Integration**: Clipdrop API

### Infrastructure
- **Deployment**: Vercel (Client and Server)

## 📁 Project Structure

```
Imagen/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context
│   │   └── assets/      # Static assets
│   └── vercel.json      # Vercel config
│
├── server/              # Express backend
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   └── vercel.json      # Vercel serverless config
```

## Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

Ensure you have the following installed or created:

- Node.js (v18 or higher)
- A MongoDB Atlas account
- A Clipdrop API key
- Google OAuth credentials (Client ID and Secret)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/imagen.git
cd imagen
```

### 2. Backend Configuration

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
CLIPDROP_API=your_clipdrop_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

Start the development server:

```bash
npm start
```

### 3. Frontend Configuration

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd API Reference

### User Management

- `POST /api/user/register` - Create a new user account
- `POST /api/user/login` - Authenticate an existing user
- `GET /api/user/google` - Initiate Google OAuth login
- `GET /api/user/google/callback` - Handle Google OAuth callback
- `POST /api/user/credits` - Retrieve current user credit balance
- `POST /api/user/pay-credits` - Simulate credit purchase

### Image Operations

- `POST /api/image/generate-image` - Request a new image generation
- `GET /api/image/user-images` - Retrieve paginated list of user images
- `DELETE /api/image/delete-image/:id` - Remove a specific image
- `DELETE /api/image/delete-multiple` - Batch delete images
- `PATCH /api/image/toggle-favorite/:id` - Update favorite status
- `GET /api/image/stats` - Retrieve usage statistics

## 🔧 Challenges & Solutions

During development, several critical challenges were encountered and solved:

### 1. **Authentication Security (Postman API Bypass)**
   - **Problem**: Initial authentication endpoint lacked proper validation. Attackers could craft malformed requests via tools like Postman to bypass security checks. Generic error messages also revealed account existence.
   - **Solution**: 
     - Implemented specific error messages that provide user guidance without revealing account enumeration information
     - Added comprehensive input validation for all auth fields (name length, email format, password strength)
     - Separated validation errors (helpful for users) from auth errors (generic for security)
     - Error messages now guide users (e.g., "Password must be at least 8 characters" during signup, but "Invalid email or password" during login)

### 2. **API Quota Exhaustion & User Experience**
   - **Problem**: When the Clipdrop API quota was reached, users would get blank results or confusing errors, breaking the application experience.
   - **Solution**:
     - Implemented intelligent **demo mode** that automatically detects when the API quota is exhausted
     - System falls back to curated sample images from Unsplash with a clear notification
     - Users can continue exploring the app without interruption
     - Maintains credit system integrity while providing a graceful degradation

### 3. **Docker Compatibility Issues**
   - **Problem**: App was configured for Vercel serverless deployment but failed in Docker environments due to:
     - MongoDB connection string differences (Atlas vs local Docker MongoDB)
     - Vite dev server not accessible in Docker volumes
     - Missing authSource parameter for MongoDB authentication
   - **Solution**:
     - Enhanced MongoDB configuration to auto-detect environment (Atlas vs local Docker)
     - Configured Vite to use polling for Docker volume changes
     - Added authSource parameter for proper Docker MongoDB authentication
     - Maintained backward compatibility with Vercel deployment

### 4. **CI/CD Pipeline Health Check Failures**
   - **Problem**: GitHub Actions CI workflow was failing because:
     - Health check endpoint path mismatch (`/health` vs `/`)
     - Missing critical environment variables in CI environment
     - Docker Compose health checks pointing to wrong endpoints
   - **Solution**:
     - Standardized health check to use root endpoint (`/`)
     - Added all required env vars to CI workflow configuration (SESSION_SECRET, API keys, URLs)
     - Updated docker-compose.yml health check configuration
     - Set proper ports for health checks (3000 for dev, 80 for production)

### 5. **Multi-Container Orchestration**
   - **Problem**: Coordinating client, server, and MongoDB containers with proper networking and health checks.
   - **Solution**:
     - Set up Docker Compose with proper service dependencies
     - Implemented health checks for all services
     - Configured environment-based build triggers for automated Docker Hub deployment
     - Added GitHub Actions workflow for CI/CD with automated testing

### 6. **Environment Configuration Management**
   - **Problem**: Managing different configurations across local development, Docker, and Vercel deployment.
   - **Solution**:
     - Created comprehensive `.env.example` template for developers
     - Implemented environment-aware configuration in both frontend and backend
     - Added fallback values for optional configurations
     - Documented all required environment variables

## Deployment

This project is configured for deployment on Vercel.

### Backend Deployment:

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Set the **Root Directory** to `server`
4. Add all environment variables defined in your backend `.env` file to the Vercel project settings
5. Deploy

### Frontend Deployment:

1. Import the same repository into a new Vercel project
2. Set the **Root Directory** to `client`
3. Add the `VITE_BACKEND_URL` environment variable (pointing to your deployed backend URL)
4. Deploy

## Contributing

Contributions are welcome. Please feel free to open an issue or submit a Pull Request if you have suggestions for improvements or bug fixes.

## License

This project is open source and available under the MIT License.

## Author

**Chaitanya Kelkar**

## Acknowledgments

- [Clipdrop API](https://clipdrop.co/apis) for AI image generation
- [Unsplash](https://unsplash.com) for demo images
- [Vercel](https://vercel.com) for hosting

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Chaitanya Kelkar

## 🙏 Acknowledgments

- [Clipdrop API](https://clipdrop.co/apis) for AI image generation
- [Unsplash](https://unsplash.com) for demo images
- [Vercel](https://vercel.com) for hosting

---

⭐ Star this repo if you found it helpful!
