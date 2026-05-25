#  Blog App Frontend

Welcome to the **Blogify Frontend Client**—a premium, enterprise-grade, high-fidelity React 19 Single Page Application (SPA) designed to power the user-facing interface of the **Blogify Multi-Role Article Sharing Platform**. 

Inspired by **Apple's iconic, ultra-clean web aesthetics (Apple Light Theme)**, this client application is meticulously engineered around raw typography, strict layout constraints, crisp spacing, and smooth micro-animations. It operates seamlessly in multi-role environments (`USER` readers and `AUTHOR` creators), offering instant state synchronization, role-isolated dashboards, in-context comments threads, and bulletproof security guards.



##  Client Navigation & State Architecture

This diagram visualizes the application's page structure, route protection, and Zustand state synchronization:

graph TD
  
    %% Elements
    Root[" Root Layout (Header & Footer)"]:::default
    Home[ Home Landing Page"]:::default
    Login[" Login Route"]:::default
    Register[" Register Route"]:::default
    AuthStore[("Zustand State Store <br> authStore.js")]:::state

    %% Protected Routes
    UserSec[" ProtectedRoute USER"]:::secure
    AuthSec[" ProtectedRoute AUTHOR"]:::author

    %% Dashboard Panels
    UserProfile["Explore Feed (USER)"]:::secure
    AuthorProfile["Author Workspace (AUTHOR)"]:::author
    
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


---

## Project Directory Structure

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
