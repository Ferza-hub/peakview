import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const stored = localStorage.getItem('peakedit_session')
  const [user, setUser] = useState(stored ? JSON.parse(stored) : null)

  const login = (email, password, name) => {
    const displayName = name?.trim() || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const u = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name: displayName,
      email: email.trim().toLowerCase(),
      avatar: displayName[0].toUpperCase(),
      plan: 'Pro',
      joinedAt: new Date().toISOString(),
    }
    localStorage.setItem('peakedit_session', JSON.stringify(u))
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('peakedit_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
