import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { SocketProvider } from './context/SocketContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Lazy load pages for performance
const Home            = lazy(() => import('./pages/Home'))
const Login           = lazy(() => import('./pages/auth/Login'))
const Register        = lazy(() => import('./pages/auth/Register'))
const VerifyOTP       = lazy(() => import('./pages/auth/VerifyOTP'))
const ForgotPassword  = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword   = lazy(() => import('./pages/auth/ResetPassword'))
const FaceLogin       = lazy(() => import('./pages/auth/FaceLogin'))
const DoctorsList     = lazy(() => import('./pages/Doctors'))
const DoctorDetail    = lazy(() => import('./pages/DoctorDetail'))
const BookAppointment = lazy(() => import('./pages/BookAppointment'))

// Patient Pages
const PatientDashboard    = lazy(() => import('./pages/patient/Dashboard'))
const PatientAppointments = lazy(() => import('./pages/patient/Appointments'))
const PatientProfile      = lazy(() => import('./pages/patient/Profile'))
const NextGenAI           = lazy(() => import('./pages/patient/NextGenAI'))
const Emergency           = lazy(() => import('./pages/patient/Emergency'))
const Ecosystem           = lazy(() => import('./pages/patient/Ecosystem'))
const SmartTrack          = lazy(() => import('./pages/patient/SmartTrack'))
const PatientChat         = lazy(() => import('./pages/patient/Chat'))
const VideoConsultation   = lazy(() => import('./pages/patient/VideoConsultation'))

// Doctor Pages
const DoctorDashboard    = lazy(() => import('./pages/doctor/Dashboard'))
const DoctorAppointments = lazy(() => import('./pages/doctor/Appointments'))
const DoctorProfile      = lazy(() => import('./pages/doctor/Profile'))
const DoctorEarnings     = lazy(() => import('./pages/doctor/Earnings'))
const DoctorChat         = lazy(() => import('./pages/doctor/Chat'))
const DoctorAvailability = lazy(() => import('./pages/doctor/Availability'))

// Admin Pages
const AdminDashboard    = lazy(() => import('./pages/admin/Dashboard'))
const AdminDoctors      = lazy(() => import('./pages/admin/Doctors'))
const AdminUsers        = lazy(() => import('./pages/admin/Users'))
const AdminAppointments = lazy(() => import('./pages/admin/Appointments'))
const AdminRevenue      = lazy(() => import('./pages/admin/Revenue'))

// Loading spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      <p className="text-primary-600 font-semibold animate-pulse">Loading MediConnect...</p>
    </div>
  </div>
)

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, initialLoading } = useAuth()
  if (initialLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

// Public only route (redirect authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, initialLoading } = useAuth()
  if (initialLoading) return <PageLoader />
  if (isAuthenticated) {
    const redirects = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' }
    return <Navigate to={redirects[user?.role] || '/'} replace />
  }
  return children
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"        element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-otp"      element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/face-login"      element={<PublicRoute><FaceLogin /></PublicRoute>} />

        {/* Book Appointment (protected) */}
        <Route path="/book/:doctorId" element={
          <ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>
        } />

        {/* ── Patient Dashboard ── */}
        <Route path="/patient" element={
          <ProtectedRoute roles={['patient']}><DashboardLayout role="patient" /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<PatientDashboard />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="nextgen-ai"   element={<NextGenAI />} />
          <Route path="emergency"    element={<Emergency />} />
          <Route path="ecosystem"    element={<Ecosystem />} />
          <Route path="smart-track"  element={<SmartTrack />} />
          <Route path="telemedicine" element={<VideoConsultation />} />
          <Route path="chat"         element={<PatientChat />} />
          <Route path="profile"      element={<PatientProfile />} />
        </Route>

        {/* ── Doctor Dashboard ── */}
        <Route path="/doctor" element={
          <ProtectedRoute roles={['doctor']}><DashboardLayout role="doctor" /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="availability" element={<DoctorAvailability />} />
          <Route path="earnings"     element={<DoctorEarnings />} />
          <Route path="chat"         element={<DoctorChat />} />
          <Route path="profile"      element={<DoctorProfile />} />
        </Route>

        {/* ── Admin Dashboard ── */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}><DashboardLayout role="admin" /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<AdminDashboard />} />
          <Route path="doctors"      element={<AdminDoctors />} />
          <Route path="users"        element={<AdminUsers />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="revenue"      element={<AdminRevenue />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
            <h1 className="text-8xl font-black text-gradient mb-4">404</h1>
            <p className="text-xl text-slate-500 mb-8">Page not found</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg, #fff)',
                  color: '#1e293b',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                  fontWeight: '500',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#0066ff', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
