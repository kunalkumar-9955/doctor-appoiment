import React, { useState, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'
import { Stethoscope, Mail, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function VerifyOTP() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { verifyOTP, loading } = useAuth()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputs = useRef([])

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputs.current[idx - 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    const next = [...otp]
    pasted.forEach((d, i) => { next[i] = d })
    setOtp(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter all 6 digits'); return }
    const result = await verifyOTP(email, code)
    if (result.success) {
      const paths = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' }
      navigate(paths[result.role] || '/')
    }
  }

  const resend = async () => {
    try {
      await authAPI.resendOTP({ email })
      toast.success('OTP resent!')
    } catch { toast.error('Failed to resend') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">Verify Your Email</h2>
          <p className="text-slate-500 mt-2 text-sm">
            We sent a 6-digit code to<br />
            <span className="font-semibold text-primary-600">{email}</span>
          </p>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Enter OTP</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
              {otp.map((d, i) => (
                <input key={i} ref={el => inputs.current[i] = el}
                  type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => handleChange(e.target.value, i)}
                  onKeyDown={e => handleKey(e, i)}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none
                    ${d ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white'}
                    focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30`}
                />
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Verify OTP'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button onClick={resend} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium mx-auto">
              <RefreshCw className="w-4 h-4" /> Resend OTP
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
