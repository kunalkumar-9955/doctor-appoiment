import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Heart, Clock, Watch, Bell, Shield, MapPin, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const heartData = Array.from({ length: 24 }).map((_, i) => ({ time: `${i}:00`, bpm: 65 + Math.random() * 30 }))

export default function SmartTrack() {
  const [tab, setTab] = useState('wearables')

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2"><Zap className="w-8 h-8 text-yellow-500" />Smart Tracking</h1>
        <p className="text-slate-400 mt-1">Wearables sync, Medicine Reminders, and Health Timeline</p>
      </div>

      <div className="flex gap-2">
        {[{id:'wearables', icon:Watch, label:'Wearables'}, {id:'meds', icon:Bell, label:'Medicine Reminders'}, {id:'timeline', icon:Activity, label:'Health Timeline'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${tab===t.id ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>
            <t.icon className="w-4 h-4"/> {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
        {tab === 'wearables' && (
          <div className="space-y-6">
            <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-rose-500">
                  <Watch className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Apple Watch Series 9</h3>
                  <p className="text-sm text-green-500 font-semibold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> Synced 2 mins ago</p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform">Manage Devices</button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse"/> Heart Rate</h3>
                    <p className="text-3xl font-black mt-2 text-slate-800 dark:text-white">72 <span className="text-base text-slate-400 font-medium">BPM</span></p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={heartData}>
                    <Tooltip contentStyle={{borderRadius:'12px', border:'none'}}/>
                    <Line type="monotone" dataKey="bpm" stroke="#f43f5e" strokeWidth={4} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-6">
                <div className="glass-card p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <p className="text-sm font-medium opacity-80">Blood Oxygen</p>
                  <p className="text-4xl font-black mt-1">98%</p>
                  <p className="text-xs opacity-80 mt-4">Normal Level</p>
                </div>
                <div className="glass-card p-6 bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                  <p className="text-sm font-medium opacity-80">Sleep Quality</p>
                  <p className="text-4xl font-black mt-1">7h 20m</p>
                  <p className="text-xs opacity-80 mt-4">Deep Sleep: 2h 15m</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'meds' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Today's Medicines</h2>
            <div className="space-y-4">
              {[
                { name: 'Amoxicillin 500mg', time: '08:00 AM', status: 'taken', type: 'After Breakfast' },
                { name: 'Vitamin D3', time: '01:00 PM', status: 'pending', type: 'After Lunch' },
                { name: 'Paracetamol', time: '08:00 PM', status: 'upcoming', type: 'After Dinner' },
              ].map((m,i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.status==='taken'?'bg-green-100 text-green-600':m.status==='pending'?'bg-yellow-100 text-yellow-600':'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>
                      <Bell className="w-5 h-5"/>
                    </div>
                    <div>
                      <h4 className={`font-bold ${m.status==='taken'?'text-slate-400 line-through':'text-slate-800 dark:text-white'}`}>{m.name}</h4>
                      <p className="text-xs text-slate-500">{m.time} • {m.type}</p>
                    </div>
                  </div>
                  {m.status === 'pending' && <button className="btn-primary text-xs py-1.5 px-4 shadow-glass-primary animate-pulse">Mark Taken</button>}
                  {m.status === 'taken' && <span className="text-green-500 text-sm font-bold">✓ Taken</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
