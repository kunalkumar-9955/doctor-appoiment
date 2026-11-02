import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Stethoscope, Calendar, DollarSign, TrendingUp, Clock, ShieldCheck, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import API from '../../services/api'
const adminFetch = { stats: () => API.get('/admin/stats'), revenue: () => API.get('/admin/revenue') }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [revenue, setRevenue] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminFetch.stats(), adminFetch.revenue()])
      .then(([sRes, rRes]) => { setStats(sRes.data.data); setRevenue(rRes.data.data?.monthly || []) })
      .finally(() => setLoading(false))
  }, [])

  const STAT_CARDS = [
    { label: 'Total Patients',  value: stats?.totalUsers || 0,          icon: Users,        color: 'bg-blue-500',    text: 'text-blue-600' },
    { label: 'Active Doctors',  value: stats?.totalDoctors || 0,        icon: Stethoscope,  color: 'bg-emerald-500', text: 'text-emerald-600' },
    { label: 'Appointments',    value: stats?.totalAppointments || 0,   icon: Calendar,     color: 'bg-purple-500',  text: 'text-purple-600' },
    { label: "Today's Appts",   value: stats?.todayAppointments || 0,   icon: Clock,        color: 'bg-orange-500',  text: 'text-orange-600' },
    { label: 'Pending Doctors', value: stats?.pendingDoctors || 0,      icon: ShieldCheck,  color: 'bg-yellow-500',  text: 'text-yellow-600' },
    { label: 'Total Revenue',   value: `₹${((stats?.totalRevenue||0)/1000).toFixed(1)}K`, icon: DollarSign, color: 'bg-green-500', text: 'text-green-600' },
  ]

  const chartData = [...revenue].reverse().map(m => ({
    name: MONTHS[(m._id?.month||1)-1],
    revenue: m.total||0, count: m.count||0
  }))

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_,i) => <div key={i} className="glass-card h-24 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }} className="stat-card">
            <div className={`stat-icon ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div><div className={`text-2xl font-black ${s.text}`}>{s.value}</div><p className="text-xs text-slate-500">{s.label}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-500" />Revenue Analytics
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="url(#adminGrad)" radius={[6,6,0,0]} />
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-slate-400 py-16 text-sm">No revenue data yet</p>}
      </div>
    </div>
  )
}
