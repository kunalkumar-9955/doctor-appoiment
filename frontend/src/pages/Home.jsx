import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Star, Calendar, Shield, Brain, ArrowRight, Heart, Activity, Users, Award, ChevronRight, Stethoscope, Video, Clock, CheckCircle } from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { doctorAPI } from '../services/api'

const DEPARTMENTS = [
  { name: 'Cardiology',    icon: '❤️', color: 'from-red-500 to-pink-500',    count: '24 Doctors' },
  { name: 'Neurology',     icon: '🧠', color: 'from-purple-500 to-violet-500', count: '18 Doctors' },
  { name: 'Orthopedics',   icon: '🦴', color: 'from-blue-500 to-cyan-500',    count: '22 Doctors' },
  { name: 'Pediatrics',    icon: '👶', color: 'from-yellow-500 to-orange-500', count: '30 Doctors' },
  { name: 'Dermatology',   icon: '🧴', color: 'from-green-500 to-teal-500',   count: '15 Doctors' },
  { name: 'Ophthalmology', icon: '👁️', color: 'from-indigo-500 to-blue-500',  count: '12 Doctors' },
  { name: 'Gynecology',    icon: '🌸', color: 'from-pink-500 to-rose-500',    count: '20 Doctors' },
  { name: 'Psychiatry',    icon: '🧘', color: 'from-cyan-500 to-sky-500',     count: '16 Doctors' },
]

const STATS = [
  { value: 1500, suffix: '+', label: 'Expert Doctors',       icon: Stethoscope, color: 'bg-blue-500' },
  { value: 50000, suffix: '+', label: 'Happy Patients',      icon: Users,       color: 'bg-green-500' },
  { value: 98,   suffix: '%', label: 'Satisfaction Rate',    icon: Star,        color: 'bg-yellow-500' },
  { value: 24,   suffix: '/7', label: 'Support Available',   icon: Clock,       color: 'bg-purple-500' },
]

const WHY_US = [
  { icon: Brain,    title: 'AI-Powered',      desc: 'Smart symptom checker and doctor recommendations powered by Gemini AI.', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  { icon: Video,    title: 'Video Consult',   desc: 'HD video consultations with certified doctors from your home.', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { icon: Shield,   title: 'Secure & Private',desc: 'HIPAA-compliant platform with end-to-end encrypted health records.', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
  { icon: Calendar, title: 'Easy Booking',    desc: 'Book appointments in seconds with real-time slot availability.', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Patient', rating: 5, text: 'MediConnect AI saved me so much time! I found a great cardiologist and booked within minutes. The video consultation was crystal clear.' },
  { name: 'Dr. Rahul Verma', role: 'Cardiologist', rating: 5, text: 'As a doctor, this platform streamlines my practice beautifully. Managing appointments and patient records has never been easier.' },
  { name: 'Ankit Patel', role: 'Patient', rating: 5, text: 'The AI symptom checker gave me excellent guidance before my appointment. It\'s like having a medical advisor available 24/7.' },
]

export default function Home() {
  const [search, setSearch]   = useState('')
  const [doctors, setDoctors] = useState([])
  const navigate = useNavigate()
  const { ref: statsRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    doctorAPI.getAll({ limit: 4 }).then(r => setDoctors(r.data.data)).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/doctors?search=${search}`)
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-mesh overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                AI-Powered Healthcare Platform
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-black leading-tight text-slate-900 dark:text-white mb-6">
                Your Health,<br />
                <span className="text-gradient">Our Priority</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">
                Connect with 1500+ certified doctors. Book appointments, consult online, and manage your health with AI-powered tools.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by doctor, specialty, department..."
                    className="input-field pl-12 h-14 text-base shadow-card" />
                </div>
                <button type="submit" className="btn-primary h-14 px-8 flex items-center gap-2 text-base">
                  Search <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary flex items-center gap-2">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/doctors" className="btn-secondary flex items-center gap-2">
                  Browse Doctors <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full opacity-10 blur-3xl absolute inset-0 m-auto" />
                <div className="relative glass-card p-8 rounded-3xl shadow-glow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-800 dark:text-white">MediConnect AI</h3>
                      <p className="text-primary-500 font-semibold">Smart Healthcare</p>
                    </div>
                  </div>
                  {[
                    { icon: CheckCircle, text: '1500+ Verified Doctors', color: 'text-green-500' },
                    { icon: Video,       text: 'HD Video Consultations', color: 'text-blue-500' },
                    { icon: Brain,       text: 'AI Health Assistant',    color: 'text-purple-500' },
                    { icon: Shield,      text: 'Secure Health Records',  color: 'text-orange-500' },
                  ].map(f => (
                    <div key={f.text} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <f.icon className={`w-5 h-5 ${f.color}`} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────── */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-primary-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }} className="text-center text-white">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-black mb-1">
                  {inView && <CountUp end={stat.value} duration={2.5} separator="," />}{stat.suffix}
                </div>
                <p className="text-white/80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ───────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Top Departments</h2>
            <p className="section-subtitle mx-auto">Find specialists across all medical departments</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.map((dept, i) => (
              <motion.div key={dept.name}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/doctors?department=${dept.name}`)}
                className="glass-card p-6 text-center cursor-pointer hover:shadow-glow group transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${dept.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform`}>
                  {dept.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">{dept.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{dept.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why MediConnect AI?</h2>
            <p className="section-subtitle mx-auto">Premium features designed for modern healthcare</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle mx-auto">Trusted by thousands of patients and doctors</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-display font-black text-white mb-4">Ready to Take Control of Your Health?</h2>
            <p className="text-white/80 text-lg mb-8">Join 50,000+ patients who trust MediConnect AI for their healthcare needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all hover:-translate-y-0.5 shadow-lg">
                Start for Free
              </Link>
              <Link to="/doctors" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                Browse Doctors
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
