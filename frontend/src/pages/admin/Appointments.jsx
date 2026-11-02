import React, { useState, useEffect } from 'react'
import API from '../../services/api'
import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const STATUS_COLORS = { pending:'badge-yellow', confirmed:'badge-blue', completed:'badge-green', cancelled:'badge-red' }

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = status !== 'all' ? { status } : {}
    API.get('/admin/appointments', { params }).then(r => setAppointments(r.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false))
  }, [status])

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">All Appointments</h1><p className="text-slate-400 text-sm mt-1">Monitor all platform appointments</p></div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all','pending','confirmed','completed','cancelled'].map(t => (
          <button key={t} onClick={() => setStatus(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${status===t ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>{t}</button>
        ))}
      </div>
      {loading ? <div className="space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="glass-card h-24 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl"/>)}</div>
      : appointments.length === 0 ? <div className="glass-card p-12 text-center"><Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-400">No appointments found</p></div>
      : (
        <div className="space-y-3">
          {appointments.map((appt,i) => (
            <motion.div key={appt._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}} className="glass-card p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-800 dark:text-white">{appt.patient?.name}</span>
                    <span className="text-slate-400 text-xs">→</span>
                    <span className="font-semibold text-sm text-primary-600">Dr. {appt.doctor?.user?.name}</span>
                    <span className={STATUS_COLORS[appt.status]||'badge-gray'}>{appt.status}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{format(new Date(appt.appointmentDate), 'dd MMM yyyy')}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{appt.timeSlot?.startTime}</span>
                    <span>{appt.department}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">₹{appt.fee}</p>
                  <span className={appt.paymentStatus==='paid'?'badge-green':'badge-yellow'}>{appt.paymentStatus}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
