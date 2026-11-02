import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { doctorAPI } from '../../services/api'
import { Calendar, Users, Star, DollarSign, TrendingUp, CheckCircle, Clock, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

export default function DoctorDashboard() {
  const [stats, setStats]       = useState(null)
  const [appointments, setAppts] = useState([])
  const [accepting, setAccepting] = useState(true)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      doctorAPI.getStats(),
      doctorAPI.getAppointments({ limit: 5, status: 'pending' }),
      doctorAPI.getProfile(),
    ]).then(([statsRes, apptsRes, profileRes]) => {
      setStats(statsRes.data.data)
      setAppts(apptsRes.data.data || [])
      setAccepting(profileRes.data.data?.isAcceptingAppointments ?? true)
    }).finally(() => setLoading(false))
  }, [])

  const handleToggle = async () => {
    try {
      const res = await doctorAPI.toggleAccepting()
      setAccepting(res.data.isAcceptingAppointments)
      toast.success(`Now ${res.data.isAcceptingAppointments ? 'accepting' : 'not accepting'} appointments`)
    } catch { toast.error('Failed to update') }
  }

  const STATS = [
    { label: 'Pending',    value: stats?.pending || 0,           icon: Clock,        color: 'bg-yellow-500', text: 'text-yellow-600' },
    { label: 'Confirmed',  value: stats?.confirmed || 0,         icon: CheckCircle,  color: 'bg-blue-500',   text: 'text-blue-600' },
    { label: 'Completed',  value: stats?.completed || 0,         icon: Calendar,     color: 'bg-green-500',  text: 'text-green-600' },
    { label: 'Today',      value: stats?.todayAppointments || 0, icon: Users,        color: 'bg-purple-500', text: 'text-purple-600' },
    { label: 'Earnings',   value: `₹${(stats?.totalEarnings||0).toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500', text: 'text-emerald-600' },
    { label: 'Rating',     value: stats?.rating ? `${stats.rating}★` : 'N/A', icon: Star, color: 'bg-orange-500', text: 'text-orange-600' },
  ]

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card h-24 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Doctor Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Overview of your practice</p>
        </div>
        <button onClick={handleToggle}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${accepting ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
          {accepting ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          {accepting ? 'Accepting Appointments' : 'Not Accepting'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="stat-card">
            <div className={`stat-icon ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div><div className={`text-2xl font-black ${s.text}`}>{s.value}</div><p className="text-xs text-slate-500">{s.label}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Appointments */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-500" />Pending Appointments</h2>
            <Link to="/doctor/appointments" className="text-xs text-primary-600 font-semibold flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></Link>
          </div>
          {appointments.length === 0 ? (
            <p className="text-center text-slate-400 py-8 text-sm">No pending appointments</p>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 4).map(appt => (
                <div key={appt._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {appt.patient?.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{appt.patient?.name}</p>
                    <p className="text-xs text-slate-400">{new Date(appt.appointmentDate).toLocaleDateString()} • {appt.timeSlot?.startTime}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={async () => { await doctorAPI.updateApptStatus(appt._id, { status:'confirmed' }); toast.success('Confirmed') }}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200">✓</button>
                    <button onClick={async () => { await doctorAPI.updateApptStatus(appt._id, { status:'cancelled' }); toast.success('Rejected') }}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">✗</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" />Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to:'/doctor/appointments', icon:'📋', label:'All Appointments', color:'from-blue-500 to-cyan-500' },
              { to:'/doctor/availability', icon:'🗓️', label:'Set Availability',  color:'from-purple-500 to-violet-500' },
              { to:'/doctor/earnings',     icon:'💰', label:'View Earnings',     color:'from-emerald-500 to-teal-500' },
              { to:'/doctor/chat',         icon:'💬', label:'Patient Messages',  color:'from-orange-500 to-amber-500' },
            ].map(action => (
              <Link key={action.to} to={action.to}
                className={`bg-gradient-to-br ${action.color} rounded-xl p-4 text-white hover:shadow-glass transition-all hover:-translate-y-0.5`}>
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="font-semibold text-sm">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
