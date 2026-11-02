import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, Stethoscope, ArrowRight, ScanFace } from 'lucide-react'

export default function Login() {
  const { login, loginWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)

  const redirect = (role) => {
    const paths = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' }
    navigate(location.state?.from || paths[role] || '/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form.email, form.password)
    if (result.success) redirect(result.role)
  }

  const handleGoogle = async () => {
    const result = await loginWithGoogle('patient')
    if (result.success) redirect(result.role)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-cyan-400/15 rounded-full blur-3xl animate-float" style={{animationDelay:'3s'}} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-black text-2xl text-gradient">MediConnect AI</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">Welcome back</h2>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        <div className="glass-card p-8">
          {/* Google Login */}
          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 rounded-xl text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all mb-6 disabled:opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-slate-200 dark:border-slate-700" />
            <span className="text-slate-400 text-xs font-medium">OR</span>
            <hr className="flex-1 border-slate-200 dark:border-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required placeholder="you@example.com"
                  className="input-field pl-10"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="input-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-4">
            <Link to="/face-login" className="btn-secondary w-full flex items-center justify-center gap-3">
              <ScanFace className="w-5 h-5 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-300 font-semibold">Face Recognition Login</span>
            </Link>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
