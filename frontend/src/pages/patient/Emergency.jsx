import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, Siren as Ambulance, PhoneCall, Clock, Navigation, Search } from 'lucide-react'

export default function Emergency() {
  const [bookingState, setBookingState] = useState('idle')

  const handleSOS = () => {
    setBookingState('searching')
    setTimeout(() => setBookingState('booked'), 3000)
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500" /> Emergency & Ambulance
        </h1>
        <p className="text-slate-400 mt-1">Smart SOS, real-time ambulance tracking, and emergency booking</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* SOS Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-red-50 to-white dark:from-red-900/10 dark:to-slate-900 border border-red-100 dark:border-red-900/30">
            <h2 className="font-bold text-slate-800 dark:text-white mb-2">Smart Emergency SOS</h2>
            <p className="text-xs text-slate-500 mb-8 max-w-xs">Pressing this button will instantly dispatch an ambulance to your GPS location and notify your emergency contacts.</p>
            
            <button onClick={handleSOS} disabled={bookingState !== 'idle'} 
              className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${bookingState === 'idle' ? 'bg-red-500 hover:bg-red-600 hover:scale-105 shadow-[0_0_40px_rgba(239,68,68,0.5)]' : 'bg-red-500/50 scale-95'}`}>
              
              {bookingState === 'searching' && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping" />
                  <div className="absolute -inset-8 rounded-full border-2 border-red-500/20 animate-spin-slow border-t-transparent" />
                </>
              )}
              
              <div className="text-white text-center">
                {bookingState === 'idle' && <><AlertTriangle className="w-12 h-12 mx-auto mb-2" /><span className="text-2xl font-black tracking-widest">SOS</span></>}
                {bookingState === 'searching' && <span className="text-lg font-bold animate-pulse">Locating...</span>}
                {bookingState === 'booked' && <span className="text-lg font-bold">Dispatched!</span>}
              </div>
            </button>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {[ { name: 'Wife', phone: '+1 234 567 8900' }, { name: 'Family Doctor', phone: '+1 987 654 3210' }].map((c,i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div><p className="font-semibold text-sm text-slate-800 dark:text-white">{c.name}</p><p className="text-xs text-slate-500">{c.phone}</p></div>
                  <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><PhoneCall className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Tracking Map Panel */}
        <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col relative h-[600px]">
          {/* Fake Map Background */}
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at center, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="p-6 relative z-10 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Live Ambulance Tracking</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> Current Location: 42.3601° N, 71.0589° W</p>
            </div>
            {bookingState === 'booked' && <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">Ambulance En Route</span>}
          </div>

          <div className="flex-1 relative z-10 p-6 flex flex-col justify-end">
            {bookingState === 'idle' ? (
              <div className="self-center mb-auto mt-32 text-center">
                <Navigation className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Map offline. Press SOS to trigger tracking.</p>
              </div>
            ) : (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                    <Ambulance className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Advanced Life Support (ALS)</h3>
                    <p className="text-sm text-slate-500">Vehicle No: NY-4592 • Paramedic: John Doe</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-red-500">4 <span className="text-sm font-bold text-slate-400">MINS</span></p>
                    <p className="text-xs text-slate-500">Estimated Arrival</p>
                  </div>
                </div>
                
                <div className="relative pt-4">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-3/4 animate-pulse" />
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                    <span className="text-red-500">Hospital</span>
                    <span>En Route</span>
                    <span>Your Location</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
