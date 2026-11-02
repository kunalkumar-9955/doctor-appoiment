import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Award, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function DoctorDetail() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link to="/doctors" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>
        
        <div className="glass-card p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-primary-100 to-cyan-100 flex-shrink-0 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=e2e8f0`} alt="Doctor" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs font-bold uppercase tracking-wider rounded-full">Cardiologist</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-2">Dr. Alexander Bennett</h1>
                  <p className="text-slate-500 font-medium">MBBS, MD (Cardiology), FACC</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-primary-600">₹1,500</p>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Per Consultation</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center"><Star className="w-5 h-5 fill-yellow-600" /></div>
                  <div><p className="font-bold text-slate-800 dark:text-white">4.9</p><p className="text-xs text-slate-500">120 Reviews</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><Award className="w-5 h-5" /></div>
                  <div><p className="font-bold text-slate-800 dark:text-white">15+ Years</p><p className="text-xs text-slate-500">Experience</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                  <div><p className="font-bold text-slate-800 dark:text-white">Apollo Hospital</p><p className="text-xs text-slate-500">New York, USA</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">About Doctor</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Dr. Alexander Bennett is a highly skilled Cardiologist with over 15 years of experience. He specializes in diagnosing and treating cardiovascular diseases, including coronary artery disease, heart rhythm disorders, and heart failure. He is dedicated to providing compassionate care and utilizing the latest medical advancements.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6 border-2 border-primary-100 dark:border-primary-900/50">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-primary-500"/> Working Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Mon - Fri</span><span className="font-bold text-slate-800 dark:text-white">09:00 AM - 05:00 PM</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Saturday</span><span className="font-bold text-slate-800 dark:text-white">10:00 AM - 02:00 PM</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Sunday</span><span className="font-bold text-red-500">Closed</span></div>
              </div>
              <Link to={`/book/${id}`} className="mt-8 btn-primary w-full shadow-glass-primary block text-center">Book Appointment</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
