import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, Stethoscope, ArrowRight } from 'lucide-react'

const ROLES = [
  { value: 'patient', label: '🙋 Patient', desc: 'Find & book doctors' },
  { value: 'doctor',  label: '👨‍⚕️ Doctor',  desc: 'Manage your practice' },
]

export default function Register() {
  const { register, loginWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]     = useState(1)
  const [role, setRole]     = useState('patient')
  const [showPw, setShowPw] = useState(false)
  const [form, setForm]     = useState({ name: '', email: '', password: '', phone: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register({ ...form, role })
    if (result.success) navigate('/verify-otp', { state: { email: result.email } })
  }

  const handleGoogle = async () => {
    const result = await loginWithGoogle(role)
    if (result.success) {
      const paths = { patient: '/patient/dashboard', doctor: '/doctor/dashboard' }
      navigate(paths[role])
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-cyan-400/15 rounded-full blur-3xl animate-float" style={{animationDelay:'3s'}} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-black text-2xl text-gradient">MediConnect AI</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">Create your account</h2>
          <p className="text-slate-500 mt-1 text-sm">Join 50,000+ users on MediConnect AI</p>
        </div>

        <div className="glass-card p-8">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ROLES.map(r => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  role === r.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                }`}>
                <div className="font-semibold text-sm text-slate-800 dark:text-white">{r.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 rounded-xl text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all mb-6 disabled:opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-slate-200 dark:border-slate-700" />
            <span className="text-slate-400 text-xs font-medium">OR</span>
            <hr className="flex-1 border-slate-200 dark:border-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required placeholder="John Doe" className="input-field pl-10"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required placeholder="you@example.com" className="input-field pl-10"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="input-label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input placeholder="+91 9876543210" className="input-field pl-10"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPw ? 'text' : 'password'} required minLength={6} placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-10"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
