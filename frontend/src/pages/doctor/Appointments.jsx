import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { doctorAPI } from '../../services/api'
import { Calendar, Clock, Check, X, FileText, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const TABS = ['pending','confirmed','completed','cancelled']
const STATUS_COLORS = { pending:'badge-yellow', confirmed:'badge-blue', completed:'badge-green', cancelled:'badge-red' }

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [status, setStatus]   = useState('pending')
  const [loading, setLoading] = useState(true)

  const fetchAppointments = () => {
    setLoading(true)
    doctorAPI.getAppointments({ status })
      .then(r => setAppointments(r.data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAppointments() }, [status])

  const handleStatus = async (id, newStatus) => {
    try {
      await doctorAPI.updateApptStatus(id, { status: newStatus })
      toast.success(`Appointment ${newStatus}`)
      fetchAppointments()
    } catch { toast.error('Failed to update') }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Appointments</h1><p className="text-slate-400 text-sm mt-1">Manage all patient bookings</p></div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setStatus(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${status === t ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-600'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card h-28 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}</div>
      : appointments.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No {status} appointments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, i) => (
            <motion.div key={appt._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {appt.patient?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800 dark:text-white">{appt.patient?.name}</h3>
                    <span className={STATUS_COLORS[appt.status] || 'badge-gray'}>{appt.status}</span>
                  </div>
                  <p className="text-sm text-slate-500">{appt.department} • {appt.type}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(appt.appointmentDate), 'EEE dd MMM yyyy')}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.timeSlot?.startTime} – {appt.timeSlot?.endTime}</span>
                  </div>
                  {appt.symptoms && <p className="text-xs text-slate-400 mt-1">Symptoms: {appt.symptoms}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-emerald-600">₹{appt.fee}</p>
                  {appt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatus(appt._id, 'confirmed')} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200"><Check className="w-3 h-3" />Accept</button>
                      <button onClick={() => handleStatus(appt._id, 'cancelled')} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200"><X className="w-3 h-3" />Reject</button>
                    </div>
                  )}
                  {appt.status === 'confirmed' && (
                    <button onClick={() => handleStatus(appt._id, 'completed')} className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-200"><FileText className="w-3 h-3" />Complete</button>
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
