import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  Stethoscope, LayoutDashboard, Calendar, User, FileText,
  Bot, MessageSquare, DollarSign, Clock, Users, Settings,
  ShieldCheck, BarChart3, ChevronLeft, ChevronRight,
  Sun, Moon, Bell, LogOut, Menu, X, Activity, Video
} from 'lucide-react'

const navConfig = {
  patient: [
    { to: '/patient/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patient/appointments', icon: Calendar,        label: 'Appointments' },
    { to: '/patient/nextgen-ai',   icon: Bot,             label: 'Next-Gen AI' },
    { to: '/patient/emergency',    icon: Activity,        label: 'Emergency SOS' },
    { to: '/patient/ecosystem',    icon: Users,           label: 'Ecosystem' },
    { to: '/patient/smart-track',  icon: FileText,        label: 'Smart Track' },
    { to: '/patient/telemedicine', icon: Video,           label: 'Live Consult' },
    { to: '/patient/chat',         icon: MessageSquare,   label: 'Messages' },
    { to: '/patient/profile',      icon: User,            label: 'Profile' },
  ],
  doctor: [
    { to: '/doctor/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/doctor/appointments',  icon: Calendar,        label: 'Appointments' },
    { to: '/doctor/availability',  icon: Clock,           label: 'Availability' },
    { to: '/doctor/earnings',      icon: DollarSign,      label: 'Earnings' },
    { to: '/doctor/chat',          icon: MessageSquare,   label: 'Messages' },
    { to: '/doctor/profile',       icon: User,            label: 'Profile' },
  ],
  admin: [
    { to: '/admin/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/doctors',        icon: ShieldCheck,     label: 'Doctors' },
    { to: '/admin/users',          icon: Users,           label: 'Users' },
    { to: '/admin/appointments',   icon: Calendar,        label: 'Appointments' },
    { to: '/admin/revenue',        icon: BarChart3,       label: 'Revenue' },
  ],
}

const roleColors = {
  patient: 'from-primary-600 to-cyan-500',
  doctor:  'from-emerald-600 to-teal-500',
  admin:   'from-violet-600 to-purple-500',
}

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = navConfig[role] || []

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-800 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className={`w-9 h-9 bg-gradient-to-br ${roleColors[role]} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <span className="font-display font-bold text-primary-600 dark:text-primary-400 text-sm">MediConnect</span>
            <p className="text-xs text-slate-400 capitalize">{role} Portal</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(item => {
          const Icon = item.icon
          const active = location.pathname === item.to
          return (
            <Link key={item.to} to={item.to} onClick={() => mobile && setMobileOpen(false)}
              title={collapsed && !mobile ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                ${active
                  ? `bg-gradient-to-r ${roleColors[role]} text-white shadow-glass`
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }
                ${collapsed && !mobile ? 'justify-center' : ''}`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(!collapsed || mobile) && <span className="font-medium text-sm">{item.label}</span>}
              {collapsed && !mobile && (
                <div className="absolute left-full ml-3 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className={`p-4 border-t border-slate-100 dark:border-slate-800 ${collapsed && !mobile ? 'flex justify-center' : ''}`}>
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.avatar?.url
                ? <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                : <span className="text-white font-bold">{user?.name?.[0]?.toUpperCase()}</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
            <button onClick={logout} title="Logout"
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={logout} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 relative shadow-sm transition-all duration-300">
        <Sidebar />
        {/* Collapse Toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-primary-600 shadow-sm transition-all z-10">
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-slate-900 shadow-2xl lg:hidden flex flex-col">
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 lg:flex-none">
            <h1 className="text-base font-bold text-slate-800 dark:text-white capitalize hidden lg:block">
              {navItems.find(n => location.pathname === n.to)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to={`/${role}/profile`}
              className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
