import React, { useState, useEffect } from 'react'
import API from '../../services/api'
import { DollarSign, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'
import toast from 'react-hot-toast'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminRevenue() {
  const [data, setData] = useState({ totalRevenue:0, monthly:[] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/admin/revenue').then(r => setData(r.data.data||{})).catch(()=>toast.error('Failed')).finally(()=>setLoading(false))
  }, [])

  const chartData = [...(data.monthly||[])].reverse().map(m => ({
    name: MONTHS[(m._id?.month||1)-1], revenue: m.total||0, appointments: m.count||0
  }))

  if (loading) return <div className="space-y-4">{[...Array(2)].map((_,i)=><div key={i} className="glass-card h-40 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl"/>)}</div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Revenue Analytics</h1><p className="text-slate-400 text-sm mt-1">Financial overview of the platform</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800">
          <p className="text-sm font-semibold text-violet-600 mb-1 flex items-center gap-1"><DollarSign className="w-4 h-4"/>Total Revenue</p>
          <h2 className="text-4xl font-black text-violet-700 dark:text-violet-400">₹{((data.totalRevenue||0)/1000).toFixed(1)}K</h2>
        </div>
        <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-600 mb-1 flex items-center gap-1"><TrendingUp className="w-4 h-4"/>This Month</p>
          <h2 className="text-4xl font-black text-blue-700 dark:text-blue-400">₹{((chartData[chartData.length-1]?.revenue||0)/1000).toFixed(1)}K</h2>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize:12 }} />
            <YAxis tick={{ fontSize:12 }} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={v=>[`₹${v.toLocaleString()}`,'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
