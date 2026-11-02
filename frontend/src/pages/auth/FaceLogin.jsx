import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScanFace, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function FaceLogin() {
  const navigate = useNavigate()
  const [step, setStep] = useState('scanning')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval)
            setStep('success')
            setTimeout(() => {
              toast.success('Face verified! Login successful.')
              navigate('/')
            }, 1500)
            return 100
          }
          return p + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step, navigate])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link to="/login" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-primary-600 font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Standard Login
      </Link>
      
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 transition-all duration-75" style={{ width: `${progress}%` }} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Biometric Login</h1>
        <p className="text-sm text-slate-500 mb-10">Please look directly at your camera</p>

        <div className="relative w-64 h-64 mx-auto mb-8 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
          {step === 'scanning' && (
            <>
              <div className="absolute inset-0 bg-primary-500/10 rounded-full animate-ping" />
              <div className="absolute top-0 left-0 w-full h-2 bg-primary-500/50 shadow-[0_0_20px_rgba(14,165,233,0.5)] animate-scan z-10" />
              <ScanFace className="w-24 h-24 text-slate-300 dark:text-slate-700" />
            </>
          )}
          {step === 'success' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white shadow-glass-green">
              <CheckCircle className="w-24 h-24" />
            </motion.div>
          )}
        </div>

        {step === 'scanning' ? (
          <div className="flex items-center justify-center gap-3 text-primary-600 font-semibold">
            <Loader2 className="w-5 h-5 animate-spin" /> Analyzing facial features... {progress}%
          </div>
        ) : (
          <div className="text-green-500 font-bold text-lg">Identity Confirmed!</div>
        )}
      </motion.div>
    </div>
  )
}
