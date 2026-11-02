import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { appointmentAPI } from '../../services/api'
import { Calendar, Clock, X, RefreshCw, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']
const STATUS_COLORS = { pending:'badge-yellow', confirmed:'badge-blue', completed:'badge-green', cancelled:'badge-red', 'no-show':'badge-gray' }

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([])
  const [status, setStatus]             = useState('all')
  const [loading, setLoading]           = useState(true)
  const [cancelling, setCancelling]     = useState(null)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const params = status !== 'all' ? { status } : {}
      const res = await appointmentAPI.getMy(params)
      setAppointments(res.data.data || [])
    } catch { toast.error('Failed to load appointments') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAppointments() }, [status])

  const handleCancel = async (id) => {
    setCancelling(id)
    try {
      await appointmentAPI.cancel(id, { reason: 'Cancelled by patient' })
      toast.success('Appointment cancelled')
      fetchAppointments()
    } catch { toast.error('Failed to cancel') }
    finally { setCancelling(null) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Appointments</h1>
        <p className="text-slate-400 text-sm mt-1">Manage all your medical appointments</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setStatus(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
              status === tab ? 'bg-primary-600 text-white shadow-glass' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-primary-600'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="glass-card p-6 h-28 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
        </div>
      ) : appointments.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 dark:text-white mb-2">No appointments found</h3>
          <p className="text-slate-400 text-sm">Book a consultation with one of our expert doctors.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, i) => (
            <motion.div key={appt._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                  {appt.doctor?.user?.avatar?.url
                    ? <img src={appt.doctor.user.avatar.url} className="w-full h-full object-cover" />
                    : appt.doctor?.user?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800 dark:text-white">Dr. {appt.doctor?.user?.name}</h3>
                    <span className={STATUS_COLORS[appt.status] || 'badge-gray'}>{appt.status}</span>
                  </div>
                  <p className="text-sm text-slate-500">{appt.department} • {appt.type}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(appt.appointmentDate), 'EEE, dd MMM yyyy')}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.timeSlot?.startTime} – {appt.timeSlot?.endTime}</span>
                  </div>
                  {appt.symptoms && <p className="text-xs text-slate-400 mt-1 truncate">Symptoms: {appt.symptoms}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-primary-600">₹{appt.fee}</p>
                  <span className={appt.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'}>{appt.paymentStatus}</span>
                  {['pending','confirmed'].includes(appt.status) && (
                    <button onClick={() => handleCancel(appt._id)} disabled={cancelling === appt._id}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                      {cancelling === appt._id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                      Cancel
                    </button>
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
