#  Blog App Backend - MERN Capstone API

A robust, enterprise-grade, secure RESTful API built on the MERN stack for a multi-role Blogging Platform. This API supports custom authentication, rich role-based access control (RBAC), secure media uploads via Cloudinary, and dynamic interaction features (like article feeds, comments, and status controls).

---

##  Tech Stack & Key Integrations

*   **Core Server Framework:** Node.js & Express (v5.x for modern routing capabilities)
*   **Database & Object Modeling:** MongoDB & Mongoose (Schema validation, populated relations, and custom cascade rules)
*   **Security & Encryption:** JWT (JSON Web Tokens) with dual Cookie/Header authorization support, bcryptjs (10-round salt password hashing)
*   **Media Hosting & Storage:** Cloudinary API integrated with a custom Multer memory buffer pipeline
*   **Config Management:** Dotenv for secure local and staging environment variables
*   **API Testing Framework:** Integrated Rest Client HTTP test suite (`re.http`)

---

##  Architecture & Flow Diagram

The following architecture diagram represents the request-response lifecycle from the client app down to the database and external cloud integrations:

graph TD
    Client[Client App: React / REST Client] -->|HTTP Requests / Cookies| CORS[CORS & Options Pre-flight Filter]
    CORS --> CookieParser[Cookie Parser & JSON Body Middleware]
    CookieParser --> Router{Route Dispatcher}
    
    Router -->|/common-api| CommonRouter[Common Controller]
    Router -->|/user-api| UserRouter[User Controller]
    Router -->|/author-api| AuthorRouter[Author Controller]
    Router -->|/admin-api| AdminRouter[Admin Controller]
    
    UserRouter --> verifyUser[verifyToken: USER]
    AuthorRouter --> verifyAuthor[verifyToken: AUTHOR]
    AuthorRouter --> checkAuthorMiddleware[checkAuthor Validator]
    AdminRouter --> verifyAdmin[verifyToken: ADMIN]
    
    verifyUser --> UserDB[Mongoose Models: UserModel & ArticleModel]
    verifyAuthor --> AuthorDB[Mongoose Models: UserModel & ArticleModel]
    verifyAdmin --> AdminDB[Mongoose Models: UserModel & ArticleModel]
    CommonRouter --> AuthServ[Auth Service: register / authenticate]
    
    AuthServ --> DB[(MongoDB Database)]
    UserDB --> DB
    AuthorDB --> DB
    AdminDB --> DB
    
    UserRouter --> Cloudinary[Cloudinary Media Server]
    AuthorRouter --> Cloudinary

## 📂 Project Directory Structure

Here is a high-level mapping of the project's codebase:

```text
Capstone_Project_1/
├── APIs/                  # REST Controllers & Routes
│   ├── AdminAPI.js        # Admin endpoints (moderation, blocking, listings)
│   ├── AuthorAPI.js       # Author endpoints (article management, soft-delete)
│   ├── CommonAPI.js       # Common endpoints (login, logout, token check, reset password)
│   └── UserAPI.js         # User endpoints (registration, feed, comments)
├── Models/                # Mongoose Database Schemas
│   ├── ArticleModel.js    # Article & Nested Comments Schemas
│   └── UserModel.js       # User, Author, & Admin Schema with Role configurations
├── Services/              # Business Logic & Core Handlers
│   └── authService.js     # User registration, bcrypt hashing, JWT signature service
├── config/                # Service Integrations & Configurations
│   ├── cloudinary.js      # Cloudinary SDK wrapper initialization
│   ├── cloudinaryUpload.js# Buffer stream promise wrapper for image uploads
│   └── multer.js          # File filter validation & RAM limit controls
├── middlewares/           # Global Express interceptors
│   ├── checkAuthor.js     # Validates author profile matches & checks activity
│   └── verifyToken.js     # JWT token decoder (extracts from authorization header OR cookie)
├── .env                   # Local server configuration variables (ignored in Git)
├── .gitignore             # Git untracked files specification
├── package.json           # Application dependencies & starting scripts
├── re.http                # Pre-defined HTTP REST Client test suite
└── server.js              # Application entry point, DB connector, & error middlewares
```


##  Database Schemas & Data Models

### 1. User Model (`user`)
Represents readers, creators, and moderators. Saved under `Models/UserModel.js`.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `username` | String | Required | Unique handle for the user |
| `firstname` | String | Required | First name of the account owner |
| `lastname` | String | Optional | Last name of the account owner |
| `email` | String | Required, Unique | Email address used for authentication |
| `password` | String | Required | Encrypted password (hashed with bcryptjs) |
| `profileImageUrl` | String | Optional (Default: `""`) | Cloudinary URL hosting the user's avatar |
| `role` | String | Required, Enum | Role profile: `USER`, `AUTHOR`, or `ADMIN` |
| `isActive` | Boolean | Default: `true` | Account status flag. If `false`, access is blocked |

### 2. Article Model (`article`)
Represents published posts and reader comments. Saved under `Models/ArticleModel.js`.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `author` | ObjectId | Required, Ref `user` | Reference to the author profile |
| `title` | String | Required | Header title of the article |
| `category` | String | Required | Tag category of the post |
| `content` | String | Required | Body content (Markdown/HTML/Text) |
| `comments` | Array | Subdocument Array | Nested comments referencing user ID and comment text |
| `isArticleActive` | Boolean | Default: `true` | Status flag for Soft-Deletes / Moderation |
