import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'
import { Eye, EyeOff, Lock, Stethoscope, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate  = useNavigate()
  const { loading } = useAuth()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [done, setDone]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    try {
      await authAPI.resetPassword(token, { password: form.password })
      setDone(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) { toast.error(err.message) }
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
          <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">Reset Password</h2>
        </div>
        <div className="glass-card p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Password Reset!</h3>
              <p className="text-sm text-slate-500">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {['password', 'confirm'].map((field) => (
                <div key={field}>
                  <label className="input-label">{field === 'password' ? 'New Password' : 'Confirm Password'}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPw ? 'text' : 'password'} required minLength={6}
                      placeholder="Min. 6 characters" className="input-field pl-10 pr-10"
                      value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} />
                    {field === 'confirm' && (
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
