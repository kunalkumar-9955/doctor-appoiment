import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Activity, Apple, Smile, Camera, FileText, Loader2, HeartPulse, BrainCircuit, Droplets, Flame } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const TABS = [
  { id: 'voice', label: 'AI Voice Doctor', icon: Mic },
  { id: 'predict', label: 'Disease Prediction', icon: Activity },
  { id: 'diet', label: 'Diet & Fitness', icon: Apple },
  { id: 'mental', label: 'Mental Wellness', icon: Smile },
  { id: 'skin', label: 'Skin Scanner', icon: Camera },
  { id: 'ocr', label: 'Smart OCR', icon: FileText },
]

export default function NextGenAI() {
  const [activeTab, setActiveTab] = useState('voice')
  const [isListening, setIsListening] = useState(false)
  const [uploadState, setUploadState] = useState('idle') // idle, uploading, done

  const handleSimulate = () => {
    setUploadState('uploading')
    setTimeout(() => setUploadState('done'), 2000)
  }

  const riskData = [
    { subject: 'Heart', A: 30, fullMark: 100 },
    { subject: 'Diabetes', A: 15, fullMark: 100 },
    { subject: 'BP', A: 45, fullMark: 100 },
    { subject: 'Liver', A: 10, fullMark: 100 },
    { subject: 'Kidney', A: 20, fullMark: 100 },
    { subject: 'Lungs', A: 25, fullMark: 100 },
  ]

  const moodData = [
    { day: 'Mon', mood: 80 }, { day: 'Tue', mood: 65 }, { day: 'Wed', mood: 90 },
    { day: 'Thu', mood: 75 }, { day: 'Fri', mood: 85 }, { day: 'Sat', mood: 95 }, { day: 'Sun', mood: 90 }
  ]

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-indigo-500" /> Next-Gen AI Healthcare
        </h1>
        <p className="text-slate-400 mt-1">Futuristic AI predictions, voice analysis, and computer vision</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {TABS.map(t => {
          const isActive = activeTab === t.id
          return (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setUploadState('idle') }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${isActive ? 'bg-indigo-600 text-white shadow-glass-primary scale-105' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}>
              <t.icon className={`w-4 h-4 ${isActive && t.id === 'voice' && isListening ? 'animate-pulse' : ''}`} /> {t.label}
            </button>
          )
        })}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        
        {/* Voice Doctor Assistant */}
        {activeTab === 'voice' && (
          <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
            <div className={`absolute inset-0 bg-indigo-500/5 transition-all duration-1000 ${isListening ? 'opacity-100 scale-110 blur-3xl' : 'opacity-0 scale-90'}`} />
            
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 z-10">Holographic Voice Assistant</h2>
            <p className="text-slate-500 text-sm mb-12 z-10 text-center max-w-md">Talk to MediConnect AI just like a real doctor. It understands context, emotion, and multi-language medical terms.</p>
            
            <div className="relative z-10 flex flex-col items-center">
              <button onClick={() => setIsListening(!isListening)} 
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative ${isListening ? 'bg-gradient-to-br from-indigo-500 to-cyan-400 scale-110 shadow-glass-primary' : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'}`}>
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
                    <div className="absolute -inset-4 rounded-full border-2 border-indigo-400/30 animate-spin-slow" />
                  </>
                )}
                <Mic className={`w-12 h-12 ${isListening ? 'text-white' : 'text-slate-400'}`} />
              </button>
              
              <div className="mt-8 h-12 text-center">
                {isListening ? (
                  <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-indigo-500 font-medium">"I'm listening. How are you feeling today?"</motion.p>
                ) : (
                  <p className="text-slate-400">Tap to start voice consultation</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Disease Prediction */}
        {activeTab === 'predict' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-8">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500"/> AI Risk Assessment</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{fill:'#64748b', fontSize:12}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Risk Level" dataKey="A" stroke="#6366f1" fill="#8b5cf6" fillOpacity={0.5} />
                    <Tooltip contentStyle={{borderRadius:'12px', border:'none'}} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-card p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-100 dark:border-red-900/30">
                <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2"><HeartPulse className="w-5 h-5" /> Cardiovascular Alert</h4>
                <p className="text-sm text-red-600/80 mb-4">AI detected a 30% risk trend based on your recent blood pressure logs and lack of sleep data.</p>
                <div className="w-full bg-red-200 dark:bg-red-900/50 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
              <div className="glass-card p-6">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4">AI Prevention Tips</h4>
                <ul className="space-y-3 text-sm text-slate-500">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"/> Increase daily cardio to 30 mins</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"/> Limit sodium intake to under 2,000mg</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"/> Schedule a lipid profile test next month</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Diet & Fitness */}
        {activeTab === 'diet' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-card p-6 bg-gradient-to-br from-orange-400 to-red-500 text-white">
                <div className="flex justify-between items-start"><p className="font-medium opacity-80">Calories Burned</p><Flame className="w-5 h-5 opacity-80" /></div>
                <h3 className="text-3xl font-black mt-2">1,240 <span className="text-sm font-medium opacity-80">kcal</span></h3>
                <div className="mt-4 w-full bg-black/20 rounded-full h-1.5"><div className="bg-white h-1.5 rounded-full w-[60%]" /></div>
              </div>
              <div className="glass-card p-6 bg-gradient-to-br from-blue-400 to-cyan-500 text-white">
                <div className="flex justify-between items-start"><p className="font-medium opacity-80">Water Intake</p><Droplets className="w-5 h-5 opacity-80" /></div>
                <h3 className="text-3xl font-black mt-2">2.1 <span className="text-sm font-medium opacity-80">Liters</span></h3>
                <div className="mt-4 w-full bg-black/20 rounded-full h-1.5"><div className="bg-white h-1.5 rounded-full w-[70%]" /></div>
              </div>
              <div className="glass-card p-6 bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                <div className="flex justify-between items-start"><p className="font-medium opacity-80">Diet Score</p><Apple className="w-5 h-5 opacity-80" /></div>
                <h3 className="text-3xl font-black mt-2">92<span className="text-sm font-medium opacity-80">/100</span></h3>
                <div className="mt-4 w-full bg-black/20 rounded-full h-1.5"><div className="bg-white h-1.5 rounded-full w-[92%]" /></div>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">AI Recommended Meal Plan (Today)</h3>
              <div className="space-y-3">
                {[
                  { meal: 'Breakfast', food: 'Oatmeal with berries & almond milk', cals: '320 kcal' },
                  { meal: 'Lunch', food: 'Grilled chicken salad with olive oil', cals: '450 kcal' },
                  { meal: 'Dinner', food: 'Baked salmon with quinoa & asparagus', cals: '510 kcal' }
                ].map((m,i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div><p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{m.meal}</p><p className="font-semibold text-slate-800 dark:text-white">{m.food}</p></div>
                    <span className="text-sm font-bold text-slate-500 bg-white dark:bg-slate-700 px-3 py-1 rounded-lg shadow-sm">{m.cals}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mental Health */}
        {activeTab === 'mental' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-8 text-center">
              <Smile className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">How are you feeling?</h2>
              <p className="text-slate-500 text-sm mb-8">AI mood tracking & emotional support</p>
              <div className="flex justify-center gap-4">
                {['😢','😕','😐','🙂','😁'].map((emoji, i) => (
                  <button key={i} className="text-4xl hover:scale-125 transition-transform origin-bottom">{emoji}</button>
                ))}
              </div>
              <button className="mt-10 btn-primary w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 border-none shadow-glow text-white font-bold">Talk to AI Therapist</button>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6">Mood Timeline</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fontSize:12, fill:'#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius:'12px', border:'none'}} />
                  <Line type="monotone" dataKey="mood" stroke="#eab308" strokeWidth={4} dot={{r: 4, fill:'#eab308', strokeWidth:2, stroke:'#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Skin Scanner & OCR */}
        {(activeTab === 'skin' || activeTab === 'ocr') && (
          <div className="glass-card p-12 text-center">
            {activeTab === 'skin' ? <Camera className="w-16 h-16 text-indigo-500 mx-auto mb-4" /> : <FileText className="w-16 h-16 text-indigo-500 mx-auto mb-4" />}
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              {activeTab === 'skin' ? 'AI Skin Disease Scanner' : 'Smart Prescription OCR'}
            </h2>
            <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
              {activeTab === 'skin' ? 'Upload an image of your skin condition. Our computer vision AI will identify possible dermatological issues.' : 'Upload a handwritten prescription. Our OCR engine will extract medicine names, dosages, and timings instantly.'}
            </p>
            
            <div className="relative max-w-sm mx-auto">
              {uploadState === 'idle' && (
                <button onClick={handleSimulate} className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-12 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-100/50 transition-all group">
                  <span className="font-bold text-indigo-600">Click to Upload Image</span>
                </button>
              )}
              {uploadState === 'uploading' && (
                <div className="p-12 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="mt-4 text-sm font-bold text-indigo-600 animate-pulse">Running Neural Networks...</p>
                </div>
              )}
              {uploadState === 'done' && (
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="p-8 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-200 dark:border-green-800/50 text-left">
                  {activeTab === 'skin' ? (
                    <>
                      <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">Analysis Complete</h4>
                      <p className="text-sm text-green-600/80">Match: Contact Dermatitis (89% confidence)</p>
                      <button className="mt-4 text-xs font-bold text-white bg-green-600 px-4 py-2 rounded-lg">Consult Dermatologist</button>
                    </>
                  ) : (
                    <>
                      <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">Extracted Data</h4>
                      <ul className="text-sm text-green-600/80 space-y-1 font-mono">
                        <li>1. Azithromycin 500mg - 1-0-0</li>
                        <li>2. Pantoprazole 40mg - 1-0-1</li>
                      </ul>
                      <button className="mt-4 text-xs font-bold text-white bg-green-600 px-4 py-2 rounded-lg">Add to Reminders</button>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}

      </motion.div>
    </div>
  )
}
