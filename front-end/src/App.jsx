import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import UserProfile from './components/UserProfile'
import AuthorProfile from './components/AuthorProfile'
import ArticleByID from './components/ArticleByID'
import AuthorArticle from './components/AuthorArticle'
import WriteArticle from './components/WriteArticle'
import EditArticle from './components/EditArticleForm'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './components/Unauthorized'
import { Toaster } from 'react-hot-toast'

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/unauthorized", element: <Unauthorized /> },
        {
          path: "/user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          )
        },
        {
          path: "/author-profile",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorProfile />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="articles" replace /> },
            { path: "articles", element: <AuthorArticle /> },
            { path: "write-article", element: <WriteArticle /> }
          ]
        },
        { path: "/article/:articleId", element: <ArticleByID /> },
        { path: "/edit-article/:articleId", element: <EditArticle /> }
      ]
    }
  ])

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  )
}

export default App