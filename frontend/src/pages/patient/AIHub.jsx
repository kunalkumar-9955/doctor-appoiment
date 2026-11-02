import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Activity, FileText, Pill, Send, Upload, Mic, Loader2, Thermometer, ShieldAlert, CheckCircle } from 'lucide-react'
import { aiAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const TABS = [
  { id: 'assistant', label: 'AI Chatbot', icon: Brain },
  { id: 'score', label: 'Health Score', icon: Activity },
  { id: 'reports', label: 'Report Analyzer', icon: FileText },
  { id: 'rx', label: 'Prescription Guide', icon: Pill },
]

export default function AIHub() {
  const [activeTab, setActiveTab] = useState('assistant')
  const [loading, setLoading] = useState(false)

  // Chat State
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! I am MediConnect AI. Describe your symptoms, upload a report, or ask me anything!' }])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)

  // Report State
  const [reportResult, setReportResult] = useState(null)

  const handleChat = async () => {
    if(!input.trim()) return
    const msg = { role: 'user', content: input }
    setMessages(p => [...p, msg]); setInput(''); setLoading(true)
    try {
      const res = await aiAPI.chat({ message: input, history: messages.slice(-5) })
      setMessages(p => [...p, { role: 'assistant', content: res.data.data.reply }])
    } catch { toast.error('AI unavailable') }
    finally { setLoading(false) }
  }

  const handleVoice = () => {
    setIsListening(!isListening)
    if (!isListening) toast.success('Listening... (Voice-to-text simulated)')
  }

  const handleReportUpload = async (e) => {
    if(!e.target.files[0]) return
    setLoading(true); setReportResult(null)
    setTimeout(() => {
      setReportResult({
        summary: "Your complete blood count (CBC) shows slightly elevated WBC (White Blood Cells) at 11,500/mcL, which may indicate a mild infection. Hemoglobin is normal at 14.2 g/dL.",
        flags: [{ name: "WBC", value: "11,500", status: "High", normal: "4,500 - 11,000" }],
        recommendation: "Consult a General Physician for a checkup. Stay hydrated and monitor your body temperature."
      })
      setLoading(false)
    }, 2500)
  }

  const healthScoreData = [
    { name: 'Mon', score: 72 }, { name: 'Tue', score: 75 }, { name: 'Wed', score: 71 },
    { name: 'Thu', score: 78 }, { name: 'Fri', score: 82 }, { name: 'Sat', score: 85 }, { name: 'Sun', score: 88 }
  ]

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-primary-500 bg-clip-text text-transparent">AI Health Intelligence</h1>
        <p className="text-slate-400 mt-1">Next-gen AI diagnostics, report analysis, and predictive health tracking</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {TABS.map(t => {
          const isActive = activeTab === t.id
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${isActive ? 'bg-primary-600 text-white shadow-glass-primary scale-105' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}>
              <t.icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} /> {t.label}
            </button>
          )
        })}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        
        {/* Chatbot & Symptom Checker */}
        {activeTab === 'assistant' && (
          <div className="glass-card flex flex-col h-[65vh] border-violet-500/20 shadow-glow">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-violet-500/10 to-primary-500/10 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white"><Brain className="w-5 h-5" /></div>
                <div><h3 className="font-bold text-slate-800 dark:text-white">MediBot AI</h3><p className="text-xs text-violet-600 font-semibold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online</p></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-gradient-to-br from-primary-600 to-cyan-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="p-4 bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none"><Loader2 className="w-5 h-5 text-primary-500 animate-spin" /></div></div>}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl flex gap-2 items-center">
              <button onClick={handleVoice} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-primary-500'}`}>
                <Mic className="w-5 h-5" />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()}
                placeholder="Ask about symptoms, medicines..." className="flex-1 input-field bg-white dark:bg-slate-800 h-12" />
              <button onClick={handleChat} disabled={loading || !input.trim()} className="btn-primary h-12 w-12 flex items-center justify-center rounded-xl p-0">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Health Score */}
        {activeTab === 'score' && (
          <div className="space-y-6">
            <div className="glass-card p-8 text-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
              
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Your AI Health Score</h2>
              <div className="w-48 h-48 mx-auto mt-6 rounded-full border-8 border-slate-100 dark:border-slate-800 relative flex items-center justify-center shadow-glass-primary">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-primary-500" strokeDasharray="502" strokeDashoffset={502 - (502 * 88) / 100} strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <span className="text-5xl font-black text-slate-800 dark:text-white">88</span>
                  <p className="text-sm font-semibold text-green-500 mt-1">Excellent</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-6 max-w-md mx-auto">Based on your BMI, recent activity, water intake, and sleep patterns. You are doing great!</p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6">Score Timeline</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={healthScoreData}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fontSize:12, fill:'#94a3b8'}} />
                  <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Report Analyzer */}
        {activeTab === 'reports' && (
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">AI Medical Report Analyzer</h2>
            <p className="text-slate-500 text-sm mb-6">Upload blood tests, MRI, or X-Ray reports. Our AI will break down complex medical jargon into plain English.</p>
            
            <label className="border-2 border-dashed border-primary-300 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/10 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-primary-100/50 transition-all group">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-bold text-primary-700 dark:text-primary-400">Click to upload report (PDF, JPG)</p>
              <p className="text-xs text-primary-500/70 mt-2">AI powered scanning...</p>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleReportUpload} />
            </label>

            {loading && (
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 text-primary-500 animate-spin" /> <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Extracting and analyzing medical data...</span>
              </div>
            )}

            {reportResult && !loading && (
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mt-8 space-y-6">
                <div className="p-5 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-100 dark:border-violet-800/50">
                  <h3 className="font-bold text-violet-800 dark:text-violet-300 mb-2 flex items-center gap-2"><Brain className="w-5 h-5"/> AI Summary</h3>
                  <p className="text-sm text-violet-700 dark:text-violet-400 leading-relaxed">{reportResult.summary}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-3">Detected Abnormalities</h3>
                  {reportResult.flags.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <div><p className="font-bold text-red-700 dark:text-red-400 text-sm">{f.name}</p><p className="text-xs text-red-600/70">Normal: {f.normal}</p></div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-red-600 text-lg">{f.value}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">{f.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                  <h3 className="font-bold text-green-800 dark:text-green-400 mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Next Steps</h3>
                  <p className="text-sm text-green-700 dark:text-green-500">{reportResult.recommendation}</p>
                  <button className="mt-4 btn-primary text-xs py-2 px-4 bg-green-600 hover:bg-green-700 shadow-glass-green">Find a Doctor</button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Prescription Guide */}
        {activeTab === 'rx' && (
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center h-[50vh]">
            <Pill className="w-16 h-16 text-primary-400 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">AI Prescription Scanner</h2>
            <p className="text-slate-500 text-sm max-w-md mt-2">Upload a picture of your prescription. AI will detect medicines, explain their purpose, exact dosage, and identify potential side effects.</p>
            <button className="btn-primary mt-6">Scan Prescription</button>
          </div>
        )}

      </motion.div>
    </div>
  )
}
