import React, { useState, useEffect } from 'react'
import API from '../../services/api'
import { Users, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AdminUsers() {
  const [users, setUsers]   = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole]     = useState('patient')
  const [loading, setLoading] = useState(true)

  const fetchUsers = () => {
    setLoading(true)
    API.get('/admin/users', { params: { role, search } })
      .then(r => setUsers(r.data.data || []))
      .catch(() => toast.error('Failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [role, search])

  const toggleStatus = async (id, current) => {
    try { await API.put(`/admin/users/${id}/status`, { isActive: !current }); toast.success('Status updated'); fetchUsers() }
    catch { toast.error('Failed') }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try { await API.delete(`/admin/users/${id}`); toast.success('User deleted'); fetchUsers() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Users</h1><p className="text-slate-400 text-sm mt-1">View and manage all platform users</p></div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input placeholder="Search users..." className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['patient','doctor','admin'].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${role===r ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>{r}s</button>
          ))}
        </div>
      </div>
      {loading ? <div className="space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="glass-card h-16 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl"/>)}</div>
      : users.length === 0 ? <div className="glass-card p-12 text-center"><Users className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-400">No users found</p></div>
      : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>{['Name','Email','Status','Joined','Actions'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u,i) => (
                  <motion.tr key={u._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                          {u.avatar?.url ? <img src={u.avatar.url} className="w-full h-full object-cover" /> : u.name?.[0]}
                        </div>
                        <span className="font-semibold text-sm text-slate-800 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{u.email}</td>
                    <td className="px-5 py-3"><span className={u.isActive ? 'badge-green' : 'badge-red'}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-5 py-3 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toggleStatus(u._id, u.isActive)} className="p-1.5 text-slate-400 hover:text-violet-500 transition-colors">
                          {u.isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => deleteUser(u._id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
