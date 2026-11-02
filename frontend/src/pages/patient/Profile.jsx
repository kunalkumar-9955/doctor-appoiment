import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { userAPI, uploadAPI } from '../../services/api'
import { User, Mail, Phone, MapPin, Heart, Camera, Save, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-']

export default function PatientProfile() {
  const { user, updateUser } = useAuth()
  const [form, setForm]   = useState({ name:'', phone:'', gender:'', dateOfBirth:'', bloodGroup:'', address:{ city:'', state:'', country:'India' }, allergies:[], chronicConditions:[] })
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'' })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [tab, setTab]             = useState('profile')

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name||'', phone: user.phone||'', gender: user.gender||'', bloodGroup: user.bloodGroup||'', dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', address: user.address||{ city:'',state:'',country:'India' } }))
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await userAPI.updateProfile(form)
      updateUser(res.data.data)
      toast.success('Profile updated successfully!')
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await uploadAPI.upload(fd)
      await userAPI.uploadAvatar({ url: res.data.data.url, public_id: res.data.data.public_id })
      updateUser({ avatar: { url: res.data.data.url, public_id: res.data.data.public_id } })
      toast.success('Avatar updated!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const { authAPI } = await import('../../services/api')
      await authAPI.changePassword(pwForm)
      toast.success('Password changed!'); setPwForm({ currentPassword:'', newPassword:'' })
    } catch { toast.error('Password change failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal and health information</p>
      </div>

      {/* Avatar */}
      <div className="glass-card p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 overflow-hidden flex items-center justify-center">
            {user?.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" /> : <span className="text-3xl font-black text-white">{user?.name?.[0]}</span>}
          </div>
          <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <h2 className="font-bold text-xl text-slate-800 dark:text-white">{user?.name}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <span className="badge-blue mt-1 capitalize">{user?.role}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id:'profile', label:'👤 Profile' }, { id:'security', label:'🔒 Security' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSave} className="glass-card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ label:'Full Name', key:'name', icon:User, placeholder:'Your full name' }, { label:'Phone', key:'phone', icon:Phone, placeholder:'+91 9876543210' }].map(f => (
              <div key={f.key}>
                <label className="input-label">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input placeholder={f.placeholder} className="input-field pl-10"
                    value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} />
                </div>
              </div>
            ))}
            <div>
              <label className="input-label">Gender</label>
              <select className="input-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="">Select gender</option>
                <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="input-label">Date of Birth</label>
              <input type="date" className="input-field" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} />
            </div>
            <div>
              <label className="input-label">Blood Group</label>
              <select className="input-field" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input placeholder="Your city" className="input-field pl-10"
                  value={form.address?.city} onChange={e => setForm({...form, address:{...form.address, city: e.target.value}})} />
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={handlePasswordChange} className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Lock className="w-5 h-5 text-primary-500" />Change Password</h3>
          {[{ label:'Current Password', key:'currentPassword' }, { label:'New Password', key:'newPassword' }].map(f => (
            <div key={f.key}>
              <label className="input-label">{f.label}</label>
              <input type="password" required minLength={6} className="input-field" placeholder="••••••••"
                value={pwForm[f.key]} onChange={e => setPwForm({...pwForm, [f.key]: e.target.value})} />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
            Update Password
          </button>
        </form>
      )}
    </div>
  )
}
