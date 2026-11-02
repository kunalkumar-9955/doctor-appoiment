import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { appointmentAPI, aiAPI } from '../../services/api'
import { Calendar, Clock, FileText, Bot, TrendingUp, Heart, Activity, ChevronRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const STATUS_COLORS = {
  pending:   'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [tips, setTips]                 = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      appointmentAPI.getMy({ limit: 5 }),
      aiAPI.healthTips().catch(() => ({ data: { data: [] } })),
    ]).then(([apptRes, tipsRes]) => {
      setAppointments(apptRes.data.data || [])
      setTips(tipsRes.data.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const upcoming  = appointments.filter(a => ['pending','confirmed'].includes(a.status))
  const completed = appointments.filter(a => a.status === 'completed')

  const stats = [
    { label: 'Upcoming',      value: upcoming.length,  icon: Calendar,    color: 'bg-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',   text: 'text-blue-600' },
    { label: 'Completed',     value: completed.length, icon: Activity,    color: 'bg-green-500',  bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600' },
    { label: 'Health Score',  value: '85%',            icon: Heart,       color: 'bg-red-500',    bg: 'bg-red-50 dark:bg-red-900/20',     text: 'text-red-500' },
    { label: 'Reports Filed', value: 3,                icon: FileText,    color: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600' },
  ]

  if (loading) return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => <div key={i} className="glass-card p-6 h-24 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card-blue p-6 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-white">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
              <span className="text-gradient">{user?.name?.split(' ')[0]}! 👋</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Here's your health overview for today.</p>
          </div>
          <Link to="/doctors" className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Book Appointment
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`stat-icon ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div>
              <div className={`text-2xl font-black ${s.text}`}>{s.value}</div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" /> Upcoming Appointments
            </h2>
            <Link to="/patient/appointments" className="text-xs text-primary-600 font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No upcoming appointments</p>
              <Link to="/doctors" className="btn-primary mt-4 inline-flex text-sm">Book Now</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(appt => (
                <div key={appt._id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                    {appt.doctor?.user?.avatar?.url
                      ? <img src={appt.doctor.user.avatar.url} alt="" className="w-full h-full object-cover" />
                      : appt.doctor?.user?.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                      Dr. {appt.doctor?.user?.name}
                    </p>
                    <p className="text-xs text-slate-400">{appt.department}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(appt.appointmentDate), 'dd MMM yyyy')}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {appt.timeSlot?.startTime}
                      </span>
                    </div>
                  </div>
                  <span className={STATUS_COLORS[appt.status]}>{appt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Health Tips */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-purple-500" /> AI Health Tips
          </h2>
          {tips.length === 0 ? (
            <div className="space-y-3">
              {['Drink 8 glasses of water daily', 'Walk 10,000 steps', 'Sleep 7-8 hours', 'Eat more vegetables'].map(t => (
                <div key={t} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-lg">💡</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {tips.slice(0, 4).map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-lg">{tip.icon || '💡'}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{tip.category}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/patient/ai-assistant" className="btn-ghost mt-4 w-full text-center text-sm block">
            Chat with AI Assistant →
          </Link>
        </div>
      </div>
    </div>
  )
}
