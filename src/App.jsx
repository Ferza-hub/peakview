import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Calendar from './pages/Calendar'
import Ideas from './pages/Ideas'
import Scripts from './pages/Scripts'
import MediaLibrary from './pages/MediaLibrary'
import Revenue from './pages/Revenue'
import Settings from './pages/Settings'
import { ToastProvider } from './components/ui/Toast'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="ideas" element={<Ideas />} />
            <Route path="scripts" element={<Scripts />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
