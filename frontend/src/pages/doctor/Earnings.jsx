import React, { useState, useEffect } from 'react'
import { doctorAPI } from '../../services/api'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import toast from 'react-hot-toast'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function DoctorEarnings() {
  const [data, setData] = useState({ totalEarnings:0, recent:[], monthly:[] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    doctorAPI.getEarnings().then(r => setData(r.data.data || {})).catch(() => toast.error('Failed')).finally(() => setLoading(false))
  }, [])

  const chartData = [...(data.monthly || [])].reverse().map(m => ({
    name: MONTHS[(m._id?.month || 1) - 1],
    earnings: m.total || 0,
  }))

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card h-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Earnings</h1><p className="text-slate-400 text-sm mt-1">Your revenue overview</p></div>

      {/* Total Card */}
      <div className="glass-card p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
        <p className="text-sm font-semibold text-emerald-600 mb-1">Total Earnings</p>
        <h2 className="text-4xl font-black text-emerald-700 dark:text-emerald-400">₹{(data.totalEarnings || 0).toLocaleString()}</h2>
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" />Monthly Earnings</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={v => [`₹${v}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="url(#earningsGrad)" radius={[6,6,0,0]} />
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-slate-400 py-16 text-sm">No earnings data yet</p>}
      </div>

      {/* Recent Payments */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-500" />Recent Payments</h3>
        {(data.recent || []).length === 0 ? (
          <p className="text-center text-slate-400 py-8 text-sm">No payments yet</p>
        ) : (
          <div className="space-y-3">
            {data.recent.map(p => (
              <div key={p._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">{p.appointment?.appointmentDate ? new Date(p.appointment.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-xs text-slate-400">{p.invoiceNumber || 'Payment received'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">₹{p.amount}</p>
                  <span className="badge-green text-xs">Paid</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
