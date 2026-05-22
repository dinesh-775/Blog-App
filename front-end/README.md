#  Blog App Client — Premium React 19 Frontend

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.11-orange?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![React Router](https://img.shields.io/badge/React_Router-7.13.1-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

🔗 **Live Production Deploy:** [capstone-frontend-olive.vercel.app](https://capstone-frontend-olive.vercel.app/)

Welcome to the **Blogify Frontend Client**—a premium, enterprise-grade, high-fidelity React 19 Single Page Application (SPA) designed to power the user-facing interface of the **Blogify Multi-Role Article Sharing Platform**. 

Inspired by **Apple's iconic, ultra-clean web aesthetics (Apple Light Theme)**, this client application is meticulously engineered around raw typography, strict layout constraints, crisp spacing, and smooth micro-animations. It operates seamlessly in multi-role environments (`USER` readers and `AUTHOR` creators), offering instant state synchronization, role-isolated dashboards, in-context comments threads, and bulletproof security guards.

---

## 💎 Core Architecture Highlights

### 1. Apple Light Theme & Design System (`src/styles/common.js`)
Rather than scattered styling helpers, the visual language is governed by a **centralized design token registry**. Inspired by Apple's minimalist aesthetic:
* **Pristine Canvas:** Pure white canvas with soft `#f5f5f7` card backings and `#e8e8ed` dividers.
* **Apple Typography:** Strict text hierarchies utilizing bold, tracking-tight titles (`text-5xl font-bold tracking-tight`) and muted secondary gray body typography (`#6e6e73`).
* **Visual Premium Details:** Elegant `backdrop-blur-xl bg-white/85` sticky navbars, thin borders, rounded-full pills, and zero heavy shadows.
* **Vibrant Focus Elements:** The iconic `#0066cc` premium blue for primary elements, active links, and brand buttons.

### 2. State Hydration & Token Reconciliation (`src/store/authStore.js`)
Powered by **Zustand**, global authentication state management is extremely robust:
* **Session Restoration:** On application reload or initial page load, a dedicated background hook checks if a JWT token is cached in `localStorage`. If found, it fetches user metadata from the `/common-api/check-auth` backend API before completing the render lifecycle, completely preventing flashing unauthenticated contents or premature redirects.
* **Instant Logout Cleanup:** On logout, both client state and local caches are cleanly purged, while simultaneously notifying the backend API to invalidate cookies.
* **Global Loading State Hooks:** Exposes unified loading and error boundaries so pages can smoothly render loading animations during state transitions.

### 3. Bulletproof Access Security (`src/components/ProtectedRoute.jsx`)
Client routes are guarded at the component level:
* **Isolated Roles:** Supports granular array-based permissions (e.g. `allowedRoles={["AUTHOR"]}`).
* **Seamless Redirection:** Authenticates first, checking roles; if a regular reader tries to compromise creator endpoints, it seamlessly dispatches them to `/unauthorized` or `/login` paths with browser history replacement to prevent back-button loops.

### 4. Interactive Creators & Readers Dashboard
* **Dynamic Article Feed:** A fully customizable grid of articles with instant category-based queries (`technology`, `programming`, `ai`, `web-development`).
* **Author Control Center:** In-place publishing controls with detailed validations (Title length, select categories, Content size checks >= 50 characters).
* **Deep Dynamic Discussion Threading:** Features inside the article view enabling users to add comments and edit existing comments in-place.
* **Soft Deletes:** Authors can toggle article active states (soft-delete vs. restore) with visual state updates and hot-toast feedback alerts.

---

## 🗺️ Client Navigation & State Architecture

This diagram visualizes the application's page structure, route protection, and Zustand state synchronization:

```mermaid
graph TD
    %% Base Styling
    classDef default fill:#f5f5f7,stroke:#d2d2d7,stroke-width:1px,color:#1d1d1f,font-family:Inter;
    classDef secure fill:#e8f4fd,stroke:#0066cc,stroke-width:1.5px,color:#004499,font-family:Inter;
    classDef author fill:#fbf0e6,stroke:#e07a5f,stroke-width:1.5px,color:#a04020,font-family:Inter;
    classDef state fill:#f4ecf7,stroke:#8e44ad,stroke-width:1.5px,color:#6c3483,font-family:Inter;

    %% Elements
    Root[" Root Layout (Header & Footer)"]:::default
    Home["🏠 Home Landing Page"]:::default
    Login["🔑 Login Route"]:::default
    Register["📝 Register Route"]:::default
    AuthStore[("Zustand State Store <br> authStore.js")]:::state

    %% Protected Routes
    UserSec["🔒 ProtectedRoute USER"]:::secure
    AuthSec["🔒 ProtectedRoute AUTHOR"]:::author

    %% Dashboard Panels
    UserProfile["Explore Feed (USER)"]:::secure
    AuthorProfile["Author Workspace (AUTHOR)"]:::author
    AuthorArticles["List My Articles"]:::author
    WriteArticle["Write New Article"]:::author
    ArticleDetails["📖 Article Details & Comments"]:::default
    EditArticle["✏️ Edit Article Form"]:::author
    Unauthorized["🚫 Unauthorized Route"]:::default

    %% Connections & Navigation
    Root --> Home
    Root --> Login
    Root --> Register
    Root --> Unauthorized

    %% Authentication Flow
    Login -.->|Dispatches Credentials| AuthStore
    Register -.->|Creates Account| Login
    AuthStore -.->|Hydrates Token & Profile| Root

    %% Routing Guards
    Root --> UserSec
    Root --> AuthSec

    UserSec -->|Role Verified| UserProfile
    AuthSec -->|Role Verified| AuthorProfile

    %% Sub-Routing Outlet
    AuthorProfile -->|Sub Route| AuthorArticles
    AuthorProfile -->|Sub Route| WriteArticle

    %% Interactive Details
    UserProfile -->|Select Article| ArticleDetails
    AuthorArticles -->|Manage Article| ArticleDetails
    ArticleDetails -->|Author Action| EditArticle
    ArticleDetails -->|Reader Action| Comment["💬 Comments Interface"]:::secure

    %% Styling Application
    class UserSec,UserProfile,Comment secure;
    class AuthSec,AuthorProfile,AuthorArticles,WriteArticle,EditArticle author;
    class AuthStore state;
```

---

## 📂 Project Directory Structure

```text
c:\Projects\Capstone-Frontend\vite-project\
├── public/                 # Static assets (favicons, manifest, etc.)
├── src/
│   ├── assets/             # Brand logos, stock images, and visual graphics
│   ├── components/         # Page Views and Structural Layout Components
│   │   ├── ArticleByID.jsx     # Detailed article page (renders post, updates comments, toggles active status)
│   │   ├── AuthorArticle.jsx   # Grid of articles published by the logged-in author
│   │   ├── AuthorProfile.jsx   # Nested layout & sub-navigation for authors
│   │   ├── EditArticleForm.jsx # Managed editor for updating published stories
│   │   ├── ErrorBoundary.jsx   # Global error catcher for component failures
│   │   ├── Footer.jsx          # Apple-styled minimalist footer
│   │   ├── Header.jsx          # Sticky blur-backdrop navigation bar
│   │   ├── Home.jsx            # Elegant Apple-style marketing home landing page
│   │   ├── Login.jsx           # Secure login form with validation and store dispatch
│   │   ├── ProtectedRoute.jsx  # Security gate guarding routes from unauthorized roles
│   │   ├── Register.jsx        # Multi-role account creator with details & image url
│   │   ├── RootLayout.jsx      # Core wrapper mounting Header, Footer, and page transitions
│   │   ├── Unauthorized.jsx    # Graceful 403 fallback UI page
│   │   ├── UserProfile.jsx     # Reader dashboard with article grids and categories filter
│   │   └── WriteArticle.jsx    # Form creator with length & structural validations
│   ├── store/              # Centralized State Management
│   │   └── authStore.js        # Zustand global state (handles checkAuth, tokens, login & logout)
│   ├── styles/             # Application Theme styling
│   │   └── common.js           # Centralized Apple Light CSS class dictionary
│   ├── App.css             # Main styling entry (root styles, fonts)
│   ├── App.jsx             # React Router v7 routes definition tree
│   ├── index.css           # Tailwind CSS directives & custom fonts
│   └── main.jsx            # App bootstrapper
├── .env                    # Client environment settings (VITE_API_URL)
├── .gitignore              # Files excluded from Git tracking
├── eslint.config.js        # React & JS linting rules
├── index.html              # HTML shell
├── package.json            # Package dependencies, build scripts
└── vite.config.js          # Vite config (React and Tailwind plugins)
```

---

## 🛠️ Tech Stack & Key Dependencies

This project leverage a state-of-the-art modern frontend stack:
* **React 19.2.0:** Utilizing modern React hooks (`useEffect`, `useState`, `useLocation`, `useParams`).
* **Vite 7.3.1:** High-speed development server and optimized rollup production bundling.
* **Tailwind CSS v4.2.1:** Utilizing the next-generation engine with lightning-fast compile times and integrated `@tailwindcss/vite` plugin.
* **Zustand 5.0.11:** Lightweight, scalable, hooks-based global state management.
* **React Router v7.13.1:** Client-side declarative routing and sub-route nested outlets.
* **React Hook Form 7.71.2:** Flexible, performant, and lightweight form validation.
* **React Hot Toast 2.6.0:** Beautiful, responsive alerts and notification alerts.
* **Axios 1.13.6:** HTTP client configured with bearer headers and cookie-handshake support.

---

## 🔑 Environment Configuration

To run this application locally, create a `.env` file in the root `vite-project` directory. Vite requires client environment variables to be prefixed with `VITE_` to compile them into the final static build:

```ini
# Base Endpoint URL of the Running Backend Express API
VITE_API_URL=http://localhost:4000
```

---

## 🚀 Local Sandbox Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your operating system:
* **Node.js** (v18.x or v20.x recommended)
* **npm** (v9.x or v10.x) or **Yarn**

### 2. Clone and Install Dependencies
Navigate into the frontend project directory and restore all packages:
```bash
# Navigate to the project root folder
cd c:/Projects/Capstone-Frontend/vite-project

# Install required node modules
npm install
```

### 3. Run Development Server
Spin up the local Vite dev server:
```bash
npm run dev
```
Once initialized, the CLI will output the local network URL (typically `http://localhost:5173`). Open this link in your web browser.

### 4. Build for Production
To package the app into highly optimized, minified static files inside the `/dist` directory, run:
```bash
npm run build
```
This is ready to be hosted on any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

### 5. Code Quality Linting
To scan the codebase for style issues and potential bugs based on ESLint settings:
```bash
npm run lint
```

---

## 🔗 Backend API Handshake Specifications

All outgoing HTTP calls made via **Axios** adhere to the following security protocols:
1. **Bearer Token Injection:** Requests to authenticated endpoints append the cached JWT token in the Authorization header:
   ```javascript
   headers: { Authorization: `Bearer ${token}` }
   ```
2. **Cookie Inclusion:** Enable `withCredentials: true` in all axios calls to ensure secure CORS-compliant handshake configurations (e.g. CSRF tokens or cookies mapped by the backend).
3. **Common API Mappings:**
   * **Login Request:** `POST /common-api/login`
   * **Logout Request:** `GET /common-api/logout`
   * **Session Restore:** `GET /common-api/check-auth`
   * **Public Feed:** `GET /user-api/articles` (Optional category filter query: `?category=technology`)
   * **Authors Articles:** `GET /author-api/articles`
   * **Publish Article:** `POST /author-api/articles`

---

## 🌐 Production Deployment Guidelines

This full-stack application is optimized for split production hosting:
* **Frontend SPA:** Hosted on **Vercel** for high-speed edge distribution.
* **Backend API Server:** Hosted on **Render** as a managed Web Service.

---

### 🎨 Frontend Deployment: Vercel

Vercel provides native support for Vite-based SPAs. Configure your deployment as follows:

#### 1. Import Repository & Project Settings
When importing `Capstone-Frontend` in Vercel:
* **Root Directory:** **Set to `vite-project`** (since the React files are nested in the `vite-project` folder instead of the repository root). This ensures Vercel looks in the correct directory for your `package.json` and build config.
* **Framework Preset:** Select **Vite** (Vercel will auto-detect this).
* **Build Command:** `npm run build`
* **Output Directory:** `dist`

#### 2. Environment Variables
Add the following key-value pair in your Vercel Project Settings under **Environment Variables**:
* **Key:** `VITE_API_URL`
* **Value:** `https://your-backend-api.onrender.com` *(your live Render backend URL without a trailing slash)*

#### 3. Single Page Application (SPA) Routing Rewrite
Because React Router manages routing dynamically on the client side, accessing page routes (like `/user-profile` or `/author-profile`) directly by URL will throw a `404 Not Found` error unless Vercel redirects all paths back to `index.html`.

To enable seamless SPA routing on Vercel, a **`vercel.json`** file is configured in the root of the `vite-project` directory:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### ⚙️ Backend Deployment: Render

Deploy your backend folder (containing `server.js`) on Render as a **Web Service**:

#### 1. Render Web Service Settings
* **Language:** `Node`
* **Build Command:** `npm install`
* **Start Command:** `node server.js` or `npm start`
* **Root Directory:** Leave blank if the repository contains only the backend, or point to your backend directory if it is a monorepo.

#### 2. Render Environment Variables
Ensure all environment variables from the backend `.env` file are added to Render's configuration:
* `PORT` (Leave Render to assign this dynamically)
* `DB_URL` *(Your live MongoDB Atlas connection string)*
* `JWT_SECRET` *(Your secure cryptographic signature secret key)*
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` *(If image uploading is enabled)*
