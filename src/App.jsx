import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import Login from './pages/Login'

function AppRoutes() {
  const { user } = useAuth()
  if (!user) return <Login />
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/editor/:id" element={<Editor />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
