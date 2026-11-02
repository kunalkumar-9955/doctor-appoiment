import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { userAPI, uploadAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { FileText, Upload, Download, Trash2, Eye, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const TYPE_ICONS = { blood_test:'🩸', xray:'🦴', mri:'🧲', ct_scan:'📷', ecg:'💓', urine_test:'🧪', prescription:'💊', other:'📄' }

export default function HealthRecords() {
  const { user } = useAuth()
  const [records, setRecords]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', type:'blood_test', description:'' })
  const [file, setFile] = useState(null)

  const fetchRecords = async () => {
    try { const res = await userAPI.getRecords(); setRecords(res.data.data || []) }
    catch { toast.error('Failed to load records') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchRecords() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please select a file'); return }
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const uploadRes = await uploadAPI.upload(fd)
      await userAPI.uploadReport({ ...form, file: uploadRes.data.data })
      toast.success('Report uploaded successfully!')
      setShowForm(false); setForm({ title:'', type:'blood_test', description:'' }); setFile(null)
      fetchRecords()
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const TYPE_OPTIONS = ['blood_test','xray','mri','ct_scan','ecg','urine_test','prescription','other']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Health Records</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your medical documents securely</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Upload Report'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleUpload} className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white">Upload New Report</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Report Title</label>
              <input required placeholder="e.g. Blood Test Report" className="input-field"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="input-label">Report Type</label>
              <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.replace('_',' ').toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="input-label">Description (optional)</label>
            <textarea rows={2} className="input-field resize-none" placeholder="Brief description..."
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="input-label">File (PDF, JPG, PNG — max 10MB)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
              onClick={() => document.getElementById('fileInput').click()}>
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">{file ? file.name : 'Click to select file'}</p>
              <input id="fileInput" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>
          <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2">
            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload Report
          </button>
        </motion.form>
      )}

      {/* Records List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card p-5 h-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 dark:text-white mb-2">No records yet</h3>
          <p className="text-slate-400 text-sm">Upload your medical reports to keep them organized.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((rec, i) => (
            <motion.div key={rec._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }} className="glass-card p-5 hover:shadow-glow transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{TYPE_ICONS[rec.type] || '📄'}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">{rec.title}</h3>
                  <p className="text-xs text-slate-400 capitalize mt-0.5">{rec.type.replace('_',' ')}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(rec.reportDate).toLocaleDateString()}</p>
                </div>
              </div>
              {rec.description && <p className="text-xs text-slate-500 mt-3 line-clamp-2">{rec.description}</p>}
              <div className="flex gap-2 mt-4">
                <a href={rec.file?.url} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-semibold hover:bg-primary-100 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View
                </a>
                <a href={rec.file?.url} download
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
