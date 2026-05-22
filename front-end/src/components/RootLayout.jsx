import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import Footer from './Footer'

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-500 via-blue-100 to-white text-gray-900">

      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default RootLayout