# Blog Application - Capstone Project

A full-stack blog platform allowing users to read, author, and manage blog posts. The application features a distinct separation between Frontend and Backend, utilizing modern web technologies.

## 🚀 Features

- **Role-Based Access Control**: Separate portals and functionalities for Users, Authors, and Admins.
- **Authentication & Authorization**: Secure login and session management using JSON Web Tokens (JWT) and HTTP-only cookies.
- **Image Uploads**: Integrated with Cloudinary for seamless media storage and management.
- **State Management**: Efficient frontend state handling using Zustand.
- **Responsive UI**: Modern, clean, and responsive design built with React 19 and Tailwind CSS v4.

## 🛠️ Tech Stack

### Frontend (`/blog-app-frontend`)
- **Framework**: React 19 built with Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Icons & Notifications**: Lucide React, React Icons, React Hot Toast

### Backend (`/blog-app-backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcryptjs, cookie-parser
- **File Uploads**: Multer, Cloudinary
- **Environment**: dotenv

## 📂 Project Structure

```text
Capstone-Project/
├── blog-app-backend/       # Node.js/Express backend
│   ├── APIs/               # Route controllers (Admin, Author, User, Common)
│   ├── config/             # Database and cloud configurations
│   ├── middlewares/        # Custom middlewares (e.g., auth, error handling)
│   ├── models/             # Mongoose schemas
│   ├── services/           # Business logic
│   └── server.js           # Entry point for the backend
└── blog-app-frontend/      # React/Vite frontend
    ├── src/                # UI components, pages, and store
    ├── public/             # Static assets
    ├── vite.config.js      # Vite configuration
    └── package.json        # Frontend dependencies
```

## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js installed on your machine.
- MongoDB instance (local or Atlas cluster).
- Cloudinary account for media storage.

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd blog-app-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `blog-app-backend` folder with the necessary variables:
   ```env
   PORT=4000
   DB_URL=your_mongodb_connection_string
   # Add your JWT secrets and Cloudinary API credentials
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd blog-app-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL (usually `http://localhost:5173`) in your browser.
