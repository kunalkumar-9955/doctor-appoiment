import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Mail, Stethoscope, ArrowLeft, Send } from 'lucide-react'

export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await forgotPassword(email)
    if (result.success) setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2.5">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">Forgot Password</h2>
          <p className="text-slate-500 mt-1 text-sm">We'll send you a reset link</p>
        </div>
        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Email Sent!</h3>
              <p className="text-sm text-slate-500 mb-6">Check your inbox for the password reset link.</p>
              <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" required placeholder="you@example.com" className="input-field pl-10"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" /> Send Reset Link</>}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 font-medium mt-2">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
