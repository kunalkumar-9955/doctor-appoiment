import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useSocket } from '../context/SocketContext'
import {
  Stethoscope, Menu, X, Sun, Moon, Bell, ChevronDown,
  User, LogOut, LayoutDashboard, Search
} from 'lucide-react'

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { notifications } = useSocket()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const navLinks = [
    { to: '/',        label: 'Home' },
    { to: '/doctors', label: 'Find Doctors' },
  ]

  const dashboardPath = {
    patient: '/patient/dashboard',
    doctor:  '/doctor/dashboard',
    admin:   '/admin/dashboard',
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-card border-b border-slate-100 dark:border-slate-800'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-cyan transition-all duration-300">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-gradient">MediConnect</span>
                <span className="text-xs text-primary-500 font-semibold block -mt-1">AI</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`nav-link px-4 py-2 rounded-lg ${location.pathname === link.to ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle */}
              <button onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button onClick={() => navigate(dashboardPath[user?.role])}
                    className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                    <Bell className="w-5 h-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button onClick={() => setDropOpen(!dropOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                        {user?.avatar?.url
                          ? <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                          : <span className="text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                        }
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">{user?.name}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {dropOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 glass-card py-2 z-50"
                          onMouseLeave={() => setDropOpen(false)}
                        >
                          <Link to={dashboardPath[user?.role]}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link to={`/${user?.role}/profile`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <hr className="my-1 border-slate-100 dark:border-slate-700" />
                          <button onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to}
                    className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium text-sm">
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated ? (
                  <div className="flex gap-2 pt-2">
                    <Link to="/login" className="flex-1 btn-secondary text-center text-sm">Sign In</Link>
                    <Link to="/register" className="flex-1 btn-primary text-center text-sm">Get Started</Link>
                  </div>
                ) : (
                  <div className="pt-2 space-y-1">
                    <Link to={dashboardPath[user?.role]} className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-primary-50 font-medium text-sm">Dashboard</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium text-sm">Sign Out</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-16 pb-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-gradient">MediConnect AI</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Your premium AI-powered healthcare platform for finding doctors, booking appointments, and managing your health.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Find Doctors', 'Book Appointment', 'AI Assistant', 'Health Records'] },
              { title: 'Company',  links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'] },
            ].map(section => (
              <div key={section.title}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2024 MediConnect AI. All rights reserved.</p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
                <a key={s} href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
