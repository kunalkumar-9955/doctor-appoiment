import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { aiAPI } from '../../services/api'
import { Send, Bot, User, Loader2, Stethoscope, Activity, Thermometer, Brain } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const QUICK_PROMPTS = [
  { icon: '🤒', text: 'I have a headache and fever' },
  { icon: '❤️', text: 'Chest pain symptoms' },
  { icon: '😴', text: 'Sleep issues and insomnia' },
  { icon: '🦴', text: 'Joint pain and stiffness' },
]

export default function AIAssistant() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm MediConnect AI, your personal health assistant. I can help you with symptom analysis, health tips, and doctor recommendations. How can I help you today?` }
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [symptoms, setSymptoms] = useState({ text: '', age: '', gender: 'male' })
  const [checkResult, setCheckResult] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }))
      const res = await aiAPI.chat({ message: text, history })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, I am temporarily unavailable. Please try again.' }])
    }
    setLoading(false)
  }

  const handleSymptomCheck = async () => {
    if (!symptoms.text) return
    setLoading(true)
    try {
      const res = await aiAPI.symptomCheck(symptoms)
      setCheckResult(res.data.data)
    } catch { setCheckResult({ raw: 'Analysis failed. Please try again.' }) }
    setLoading(false)
  }

  return (
    <div className="space-y-6 h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Bot className="w-7 h-7 text-purple-500" /> AI Health Assistant
        </h1>
        <p className="text-slate-400 text-sm mt-1">Powered by Gemini AI — Your 24/7 healthcare companion</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'chat', label: '💬 AI Chat' }, { id: 'symptom', label: '🔍 Symptom Checker' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-purple-600'
            }`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'chat' && (
        <div className="glass-card flex flex-col" style={{ height: '60vh' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gradient-to-br from-primary-500 to-cyan-500'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                    : 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white rounded-tr-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-thin">
            {QUICK_PROMPTS.map(p => (
              <button key={p.text} onClick={() => sendMessage(p.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium whitespace-nowrap hover:bg-purple-100 transition-colors">
                {p.icon} {p.text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask me anything about your health..."
              className="input-field flex-1 text-sm" />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              className="btn-primary px-4 py-3 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'symptom' && (
        <div className="glass-card p-6 space-y-5">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" /> AI Symptom Checker
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Your Age</label>
              <input type="number" placeholder="e.g. 28" className="input-field"
                value={symptoms.age} onChange={e => setSymptoms({...symptoms, age: e.target.value})} />
            </div>
            <div>
              <label className="input-label">Gender</label>
              <select className="input-field" value={symptoms.gender} onChange={e => setSymptoms({...symptoms, gender: e.target.value})}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="input-label">Describe Your Symptoms</label>
            <textarea rows={4} placeholder="e.g. I have a high fever, headache, and body aches for the past 2 days..."
              className="input-field resize-none"
              value={symptoms.text} onChange={e => setSymptoms({...symptoms, text: e.target.value})} />
          </div>
          <button onClick={handleSymptomCheck} disabled={loading || !symptoms.text}
            className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            Analyze Symptoms
          </button>

          {checkResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800">
              <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2">
                <Bot className="w-5 h-5" /> AI Analysis Results
              </h4>
              {checkResult.raw ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">{checkResult.raw}</p>
              ) : (
                <div className="space-y-3">
                  {checkResult.severity && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Severity:</span>
                      <span className={`badge ${checkResult.severity === 'High' ? 'badge-red' : checkResult.severity === 'Medium' ? 'badge-yellow' : 'badge-green'}`}>{checkResult.severity}</span>
                    </div>
                  )}
                  {checkResult.specialist && <p className="text-sm"><span className="font-semibold">Suggested Specialist:</span> {checkResult.specialist}</p>}
                  {checkResult.conditions && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Possible Conditions:</p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {checkResult.conditions.map((c, i) => <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />{c}</li>)}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 border-t border-purple-200 dark:border-purple-800 pt-3 mt-3">
                    ⚠️ This is AI guidance only. Please consult a real doctor for diagnosis.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
