import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../config/firebase'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('mc_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Persist user to localStorage
  const saveUser = useCallback((userData, token) => {
    if (userData) {
      localStorage.setItem('mc_user', JSON.stringify(userData))
      if (token) localStorage.setItem('mc_token', token)
      setUser(userData)
    } else {
      localStorage.removeItem('mc_user')
      localStorage.removeItem('mc_token')
      setUser(null)
    }
  }, [])

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('mc_token')
    if (token) {
      authAPI.getMe()
        .then(res => { saveUser(res.data.data, token) })
        .catch(() => { saveUser(null) })
        .finally(() => setInitialLoading(false))
    } else {
      setInitialLoading(false)
    }
  }, [saveUser])

  // Register
  const register = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.register(data)
      toast.success(res.data.message)
      return { success: true, email: data.email }
    } catch (err) {
      toast.error(err.message)
      return { success: false }
    } finally { setLoading(false) }
  }

  // Login
  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await authAPI.login({ email, password })
      const userData = res.data.user || res.data.data
      saveUser(userData, res.data.token)
      toast.success('Welcome back! 👋')
      return { success: true, role: userData.role }
    } catch (err) {
      toast.error(err.message || 'Login failed')
      return { success: false }
    } finally { setLoading(false) }
  }

  // Google Login
  const loginWithGoogle = async (role = 'patient') => {
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user
      const res = await authAPI.googleAuth({
        uid:      firebaseUser.uid,
        email:    firebaseUser.email,
        name:     firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role,
      })
      saveUser(res.data.user, res.data.token)
      toast.success('Google login successful! 🎉')
      return { success: true, role: res.data.user.role }
    } catch (err) {
      toast.error(err.message || 'Google login failed')
      return { success: false }
    } finally { setLoading(false) }
  }

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    setLoading(true)
    try {
      const res = await authAPI.verifyOTP({ email, otp })
      const userData = res.data.user || res.data.data
      saveUser(userData, res.data.token)
      toast.success('Email verified successfully! ✅')
      return { success: true, role: userData.role }
    } catch (err) {
      toast.error(err.message || 'OTP verification failed')
      return { success: false }
    } finally { setLoading(false) }
  }

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout()
      await signOut(auth)
    } catch {}
    saveUser(null)
    toast.success('Logged out successfully')
  }

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true)
    try {
      const res = await authAPI.forgotPassword({ email })
      toast.success(res.data.message)
      return { success: true }
    } catch (err) {
      toast.error(err.message)
      return { success: false }
    } finally { setLoading(false) }
  }

  // Update user in state (after profile edit)
  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    saveUser(updated, localStorage.getItem('mc_token'))
  }

  const isPatient = user?.role === 'patient'
  const isDoctor  = user?.role === 'doctor'
  const isAdmin   = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user, loading, initialLoading,
      register, login, loginWithGoogle, verifyOTP,
      logout, forgotPassword, updateUser,
      isPatient, isDoctor, isAdmin,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
