// Doctor Profile re-uses patient profile with doctor-specific fields
import React, { useState, useEffect } from 'react'
import { doctorAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Save, Stethoscope, DollarSign, Award } from 'lucide-react'
import toast from 'react-hot-toast'

const SPECIALIZATIONS = ['Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','Ophthalmology','Gynecology','Psychiatry','General Medicine','ENT','Urology','Oncology']

export default function DoctorProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({})
  const [form, setForm]   = useState({ specialization:'', department:'', bio:'', consultationFee:'', experience:'', languages:[], hospital:{ name:'', city:'' } })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    doctorAPI.getProfile().then(r => {
      const d = r.data.data
      setProfile(d)
      setForm({ specialization: d.specialization||'', department: d.department||'', bio: d.bio||'', consultationFee: d.consultationFee||'', experience: d.experience||'', languages: d.languages||[], hospital: d.hospital||{ name:'', city:'' } })
    }).catch(() => {})
  }, [])

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await doctorAPI.updateProfile(form)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Doctor Profile</h1><p className="text-slate-400 text-sm mt-1">Update your professional information</p></div>

      {/* Header Card */}
      <div className="glass-card p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl font-black text-white overflow-hidden">
          {user?.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" /> : user?.name?.[0]}
        </div>
        <div>
          <h2 className="font-bold text-xl text-slate-800 dark:text-white">Dr. {user?.name}</h2>
          <p className="text-slate-400 text-sm">{profile.specialization}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="badge-green">{profile.isApproved ? '✓ Approved' : '⏳ Pending Approval'}</span>
            <span className="badge-blue">{profile.totalAppointments || 0} appointments</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="glass-card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Specialization</label>
            <select className="input-field" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})}>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Department</label>
            <input className="input-field" placeholder="e.g. Cardiology" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
          </div>
          <div>
            <label className="input-label">Experience (Years)</label>
            <input type="number" min="0" className="input-field" placeholder="e.g. 10" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
          </div>
          <div>
            <label className="input-label flex items-center gap-1"><DollarSign className="w-4 h-4" />Consultation Fee (₹)</label>
            <input type="number" min="0" className="input-field" placeholder="e.g. 500" value={form.consultationFee} onChange={e => setForm({...form, consultationFee: e.target.value})} />
          </div>
          <div>
            <label className="input-label">Hospital/Clinic Name</label>
            <input className="input-field" placeholder="Hospital name" value={form.hospital?.name} onChange={e => setForm({...form, hospital:{...form.hospital, name: e.target.value}})} />
          </div>
          <div>
            <label className="input-label">Hospital City</label>
            <input className="input-field" placeholder="City" value={form.hospital?.city} onChange={e => setForm({...form, hospital:{...form.hospital, city: e.target.value}})} />
          </div>
        </div>
        <div>
          <label className="input-label">Professional Bio</label>
          <textarea rows={3} maxLength={500} className="input-field resize-none" placeholder="Describe your expertise, approach..."
            value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
          <p className="text-xs text-slate-400 text-right mt-1">{form.bio.length}/500</p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save Profile
        </button>
      </form>
    </div>
  )
}
