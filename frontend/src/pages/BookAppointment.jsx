import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { doctorAPI, appointmentAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { format, addDays } from 'date-fns'

const TYPES = [{ value:'in-person', label:'🏥 In-Person' }, { value:'video', label:'📹 Video' }, { value:'chat', label:'💬 Chat' }]

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate     = useNavigate()
  const { user }     = useAuth()
  const [doctor, setDoctor]   = useState(null)
  const [slots, setSlots]     = useState([])
  const [selectedDate, setDate]  = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedSlot, setSlot]  = useState(null)
  const [type, setType]          = useState('in-person')
  const [symptoms, setSymptoms]  = useState('')
  const [loading, setLoading]    = useState(false)
  const [step, setStep]          = useState(1)

  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  useEffect(() => {
    doctorAPI.getById(doctorId).then(r => setDoctor(r.data.data)).catch(() => toast.error('Doctor not found'))
  }, [doctorId])

  useEffect(() => {
    if (!selectedDate) return
    appointmentAPI.getSlots({ doctorId, date: selectedDate })
      .then(r => setSlots(r.data.data || []))
      .catch(() => setSlots([]))
  }, [selectedDate, doctorId])

  const handleBook = async () => {
    if (!selectedSlot) { toast.error('Please select a time slot'); return }
    setLoading(true)
    try {
      const res = await appointmentAPI.book({
        doctorId, department: doctor?.department, appointmentDate: selectedDate,
        timeSlot: selectedSlot, type, symptoms,
      })
      toast.success('Appointment booked! 🎉')
      navigate('/patient/appointments')
    } catch (err) {
      toast.error(err.message || 'Booking failed')
    } finally { setLoading(false) }
  }

  if (!doctor) return <div className="pt-28 text-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 text-sm font-medium mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="glass-card p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-black overflow-hidden">
            {doctor.user?.avatar?.url ? <img src={doctor.user.avatar.url} className="w-full h-full object-cover" /> : doctor.user?.name?.[0]}
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800 dark:text-white">Dr. {doctor.user?.name}</h2>
            <p className="text-primary-600 font-medium text-sm">{doctor.specialization}</p>
            <p className="text-slate-400 text-sm">Consultation Fee: <span className="font-bold text-slate-700 dark:text-white">₹{doctor.consultationFee}</span></p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Consultation Type */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3">Consultation Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map(t => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={`py-3 px-3 rounded-xl border-2 text-sm font-semibold text-center transition-all ${type===t.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary-300'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-500" />Select Date</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {dates.map(date => {
                const str = format(date, 'yyyy-MM-dd')
                return (
                  <button key={str} onClick={() => { setDate(str); setSlot(null) }}
                    className={`flex-shrink-0 flex flex-col items-center py-3 px-4 rounded-xl border-2 transition-all ${selectedDate===str ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'}`}>
                    <span className="text-xs text-slate-400 font-medium">{format(date, 'EEE')}</span>
                    <span className={`text-lg font-black mt-0.5 ${selectedDate===str ? 'text-primary-600' : 'text-slate-700 dark:text-white'}`}>{format(date, 'd')}</span>
                    <span className="text-xs text-slate-400">{format(date, 'MMM')}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-primary-500" />Available Slots</h3>
            {slots.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No slots available for this date</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {slots.map((slot, i) => (
                  <button key={i} onClick={() => setSlot(slot)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${selectedSlot?.startTime===slot.startTime ? 'bg-primary-600 text-white shadow-glass' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600'}`}>
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Symptoms */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3">Reason for Visit</h3>
            <textarea rows={3} placeholder="Describe your symptoms or reason for visiting..." className="input-field resize-none"
              value={symptoms} onChange={e => setSymptoms(e.target.value)} />
          </div>

          {/* Confirm */}
          {selectedSlot && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="glass-card p-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <h3 className="font-bold text-primary-700 dark:text-primary-400 mb-3">Appointment Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-semibold">Dr. {doctor.user?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-semibold">{format(new Date(selectedDate), 'EEE, dd MMM yyyy')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-semibold">{selectedSlot.startTime} – {selectedSlot.endTime}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-semibold capitalize">{type}</span></div>
                <div className="flex justify-between border-t border-primary-200 dark:border-primary-800 pt-2 mt-2"><span className="font-bold">Total Fee</span><span className="font-black text-primary-600 text-lg">₹{doctor.consultationFee}</span></div>
              </div>
              <button onClick={handleBook} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Check className="w-4 h-4" />Confirm Booking</>}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
