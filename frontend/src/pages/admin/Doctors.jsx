import React, { useState, useEffect } from 'react'
import API from '../../services/api'
import { Check, X, Search, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([])
  const [tab, setTab]         = useState('false')
  const [loading, setLoading] = useState(true)

  const fetchDoctors = () => {
    setLoading(true)
    API.get('/admin/doctors', { params: { isApproved: tab } })
      .then(r => setDoctors(r.data.data || []))
      .catch(() => toast.error('Failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDoctors() }, [tab])

  const handleApprove = async (id, isApproved) => {
    try {
      await API.put(`/admin/doctors/${id}/approve`, { isApproved })
      toast.success(isApproved ? 'Doctor approved!' : 'Doctor rejected')
      fetchDoctors()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Doctors</h1><p className="text-slate-400 text-sm mt-1">Approve and manage doctor accounts</p></div>
      <div className="flex gap-2">
        {[{v:'false',l:'⏳ Pending'},{v:'true',l:'✅ Approved'}].map(t => (
          <button key={t.v} onClick={() => setTab(t.v)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab===t.v ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>{t.l}</button>
        ))}
      </div>
      {loading ? <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="glass-card h-24 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl"/>)}</div>
      : doctors.length === 0 ? <div className="glass-card p-16 text-center"><p className="text-slate-400">No doctors found</p></div>
      : (
        <div className="space-y-4">
          {doctors.map((doc,i) => (
            <motion.div key={doc._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} className="glass-card p-5">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                  {doc.user?.avatar?.url ? <img src={doc.user.avatar.url} className="w-full h-full object-cover" /> : doc.user?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white">Dr. {doc.user?.name}</h3>
                  <p className="text-sm text-slate-500">{doc.specialization} • {doc.department}</p>
                  <p className="text-xs text-slate-400">{doc.user?.email} • License: {doc.licenseNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={doc.isApproved ? 'badge-green' : 'badge-yellow'}>{doc.isApproved ? 'Approved' : 'Pending'}</span>
                  {!doc.isApproved && (
                    <>
                      <button onClick={() => handleApprove(doc._id, true)} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200"><Check className="w-3 h-3"/>Approve</button>
                      <button onClick={() => handleApprove(doc._id, false)} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200"><X className="w-3 h-3"/>Reject</button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
