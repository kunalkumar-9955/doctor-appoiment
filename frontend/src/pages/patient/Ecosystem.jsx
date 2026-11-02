import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, TestTube, Users, Globe, PlayCircle, Fingerprint, Shield, Search } from 'lucide-react'

const TABS = [
  { id: 'pharmacy', label: 'E-Pharmacy', icon: ShoppingBag },
  { id: 'lab', label: 'Lab Booking', icon: TestTube },
  { id: 'family', label: 'Family Health', icon: Users },
  { id: 'community', label: 'Community Forum', icon: Globe },
  { id: 'live', label: 'Doctor Live', icon: PlayCircle },
  { id: 'blockchain', label: 'Blockchain Vault', icon: Shield },
]

export default function Ecosystem() {
  const [activeTab, setActiveTab] = useState('pharmacy')

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
          <Globe className="w-8 h-8 text-emerald-500" /> Health Ecosystem
        </h1>
        <p className="text-slate-400 mt-1">Pharmacy, Labs, Community Forums, and Blockchain Security</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-glass-green scale-105' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        
        {/* Pharmacy */}
        {activeTab === 'pharmacy' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Search medicines, health products..." className="input-field pl-12 h-14 bg-white dark:bg-slate-900 rounded-2xl" />
              </div>
              <button className="btn-primary h-14 px-8 bg-emerald-600 hover:bg-emerald-700 shadow-glass-green border-none rounded-2xl">Search</button>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { name: 'Vitamin C Complex', price: '₹450', img: '💊' },
                { name: 'Whey Protein', price: '₹2400', img: '🥛' },
                { name: 'Paracetamol 500mg', price: '₹45', img: '🩹' },
                { name: 'Omega 3 Fish Oil', price: '₹890', img: '🐟' }
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform cursor-pointer">
                  <div className="text-6xl mb-4">{item.img}</div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1">{item.name}</h4>
                  <p className="text-emerald-600 font-black">{item.price}</p>
                  <button className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-xl hover:bg-emerald-600 hover:text-white transition-colors">Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blockchain Vault */}
        {activeTab === 'blockchain' && (
          <div className="glass-card p-12 text-center relative overflow-hidden bg-gradient-to-br from-slate-900 to-black border-none text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Shield className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-2 tracking-tight">Zero-Knowledge Medical Vault</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">Your medical records are encrypted and stored on a decentralized ledger. Only you hold the private keys. Doctors can only view records via temporary biometric authorization.</p>
            
            <button className="px-8 py-4 bg-emerald-500 text-black font-black rounded-2xl flex items-center justify-center gap-3 mx-auto hover:scale-105 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Fingerprint className="w-6 h-6" /> Authorize Access via Fingerprint
            </button>
            <p className="text-xs text-slate-500 mt-4 font-mono">Blockchain Status: SYNCED • Network: MediChain Mainnet</p>
          </div>
        )}

        {/* Live Stream */}
        {activeTab === 'live' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card overflow-hidden bg-black aspect-video relative group">
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" alt="Doctor Stream" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                  <PlayCircle className="w-10 h-10" />
                </button>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">LIVE</span>
                <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1"><Users className="w-3 h-3"/> 1.2k watching</span>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg text-shadow">Understanding Heart Health in 2024</h3>
                <p className="text-sm opacity-80 text-shadow">Dr. Sarah Jenkins • Cardiologist</p>
              </div>
            </div>
            <div className="glass-card flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800"><h3 className="font-bold">Live Chat</h3></div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {['Is coffee bad for BP?', 'Great insights doc!', 'What about high cholesterol?'].map((msg, i) => (
                  <div key={i} className="text-sm"><span className="font-bold text-emerald-600 dark:text-emerald-400">User_{i+10}</span> <span className="text-slate-600 dark:text-slate-300">{msg}</span></div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800"><input className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 text-sm" placeholder="Say something..." /></div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  )
}
