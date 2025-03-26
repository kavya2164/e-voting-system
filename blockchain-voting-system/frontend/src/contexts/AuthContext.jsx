import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const decoded = jwtDecode(token)
          const currentTime = Date.now() / 1000
          
          if (decoded.exp < currentTime) {
            logout()
            return
          }
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const userData = await api.get('/api/v1/auth/me')
          setUser(userData.data)
          setIsAuthenticated(true)
        } catch (error) {
          logout()
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (token) => {
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const userData = await api.get('/api/v1/auth/me')
    setUser(userData.data)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}