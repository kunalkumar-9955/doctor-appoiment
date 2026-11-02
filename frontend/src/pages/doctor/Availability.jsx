import React, { useState, useEffect } from 'react'
import { doctorAPI } from '../../services/api'
import { Clock, Save, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const generateSlots = (start = '09:00', end = '17:00', interval = 30) => {
  const slots = []
  let [h, m] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  while (h < eh || (h === eh && m < em)) {
    const startTime = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
    m += interval; if (m >= 60) { h++; m -= 60 }
    const endTime = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
    if (h < eh || (h === eh && m <= em)) slots.push({ startTime, endTime, isBooked: false })
  }
  return slots
}

export default function DoctorAvailability() {
  const [availability, setAvailability] = useState(DAYS.map(day => ({ day, isAvailable: day !== 'Sunday', slots: generateSlots() })))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    doctorAPI.getProfile().then(r => {
      if (r.data.data?.availability?.length) setAvailability(r.data.data.availability)
    }).catch(() => {})
  }, [])

  const toggleDay = (idx) => {
    const next = [...availability]
    next[idx] = { ...next[idx], isAvailable: !next[idx].isAvailable }
    setAvailability(next)
  }

  const toggleSlot = (dayIdx, slotIdx) => {
    const next = [...availability]
    next[dayIdx].slots[slotIdx].isBooked = !next[dayIdx].slots[slotIdx].isBooked
    setAvailability(next)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await doctorAPI.updateAvail({ availability })
      toast.success('Availability updated!')
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Availability</h1><p className="text-slate-400 text-sm mt-1">Set your weekly schedule</p></div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save Schedule
        </button>
      </div>

      <div className="space-y-4">
        {availability.map((day, dayIdx) => (
          <div key={day.day} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleDay(dayIdx)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${day.isAvailable ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${day.isAvailable ? 'translate-x-5' : ''}`} />
                </button>
                <h3 className="font-bold text-slate-800 dark:text-white">{day.day}</h3>
              </div>
              {day.isAvailable && <span className="text-xs text-slate-400">{day.slots.filter(s => !s.isBooked).length} slots available</span>}
            </div>
            {day.isAvailable && (
              <div className="flex flex-wrap gap-2">
                {day.slots.map((slot, slotIdx) => (
                  <button key={slotIdx} onClick={() => toggleSlot(dayIdx, slotIdx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      slot.isBooked ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 line-through' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 hover:bg-emerald-100'
                    }`}>
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
