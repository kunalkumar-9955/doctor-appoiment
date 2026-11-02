import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { doctorAPI } from '../services/api'
import { Search, Star, MapPin, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

const DEPARTMENTS = ['All','Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','Ophthalmology','Gynecology','Psychiatry','General Medicine','ENT']

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [doctors, setDoctors]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState(searchParams.get('search') || '')
  const [department, setDept]   = useState(searchParams.get('department') || 'All')

  useEffect(() => {
    setLoading(true)
    const params = { page, limit: 12 }
    if (search) params.search = search
    if (department && department !== 'All') params.department = department
    doctorAPI.getAll(params).then(r => { setDoctors(r.data.data||[]); setTotal(r.data.pagination?.total||0) }).finally(() => setLoading(false))
  }, [page, search, department])

  const handleSearch = (e) => { e.preventDefault(); setPage(1) }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-title">Find Your Doctor</h1>
          <p className="section-subtitle mx-auto">Browse 1500+ certified specialists and book your appointment today</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors, specialties..."
              className="input-field pl-12 h-12" />
          </div>
          <button type="submit" className="btn-primary h-12 px-6">Search</button>
        </form>

        {/* Dept filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin justify-center flex-wrap">
          {DEPARTMENTS.map(d => (
            <button key={d} onClick={() => { setDept(d); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${department===d ? 'bg-primary-600 text-white shadow-glass' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-primary-600 border border-slate-200 dark:border-slate-700'}`}>
              {d}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-400 mb-4">{total} doctors found</p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i) => <div key={i} className="glass-card h-72 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-24">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 dark:text-white mb-2">No doctors found</h3>
            <p className="text-slate-400 text-sm">Try a different search or department</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {doctors.map((doc,i) => (
              <motion.div key={doc._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                <Link to={`/doctors/${doc._id}`} className="doctor-card block h-full">
                  <div className="h-32 bg-gradient-to-br from-primary-500 to-cyan-500 relative flex items-center justify-center overflow-hidden">
                    {doc.user?.avatar?.url
                      ? <img src={doc.user.avatar.url} className="w-full h-full object-cover" />
                      : <span className="text-5xl font-black text-white/80">{doc.user?.name?.[0]}</span>}
                    {doc.isOnline && <span className="absolute top-3 right-3 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 dark:text-white">Dr. {doc.user?.name}</h3>
                    <p className="text-sm text-primary-600 font-medium">{doc.specialization}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.department}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{doc.rating?.toFixed(1)||'New'}</span>
                      <span className="text-xs text-slate-400">({doc.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-xs text-slate-400">{doc.experience}y exp.</p>
                      </div>
                      <p className="font-bold text-primary-600">₹{doc.consultationFee}</p>
                    </div>
                    <div className={`mt-2 text-center py-2 rounded-xl text-xs font-semibold ${doc.isAcceptingAppointments ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                      {doc.isAcceptingAppointments ? '✓ Available' : '✗ Unavailable'}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(total/12) > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-secondary px-4 py-2 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <span className="flex items-center px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Page {page} of {Math.ceil(total/12)}</span>
            <button onClick={() => setPage(p => p+1)} disabled={page>=Math.ceil(total/12)} className="btn-secondary px-4 py-2 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  )
}
