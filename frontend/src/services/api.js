import axios from 'axios'
import toast from 'react-hot-toast'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => Promise.reject(error))

// Response interceptor — handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || 'Something went wrong'
    if (error?.response?.status === 401) {
      localStorage.removeItem('mc_token')
      localStorage.removeItem('mc_user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    } else if (error?.response?.status === 429) {
      toast.error('Too many requests. Please slow down.')
    } else if (error?.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }
    return Promise.reject({ message, status: error?.response?.status })
  }
)

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  register:       (data) => API.post('/auth/register', data),
  login:          (data) => API.post('/auth/login', data),
  googleAuth:     (data) => API.post('/auth/google', data),
  verifyOTP:      (data) => API.post('/auth/verify-otp', data),
  resendOTP:      (data) => API.post('/auth/resend-otp', data),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword:  (token, data) => API.put(`/auth/reset-password/${token}`, data),
  getMe:          ()     => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/change-password', data),
  logout:         ()     => API.post('/auth/logout'),
}

// ─── Doctors ──────────────────────────────────────────
export const doctorAPI = {
  getAll:          (params) => API.get('/doctors', { params }),
  getById:         (id)     => API.get(`/doctors/${id}`),
  getProfile:      ()       => API.get('/doctors/profile/me'),
  updateProfile:   (data)   => API.put('/doctors/profile/me', data),
  updateAvail:     (data)   => API.put('/doctors/availability', data),
  getStats:        ()       => API.get('/doctors/stats/me'),
  getAppointments: (params) => API.get('/doctors/appointments/me', { params }),
  updateApptStatus:(id,data)=> API.put(`/doctors/appointments/${id}/status`, data),
  uploadPrescription:(data) => API.post('/doctors/prescriptions', data),
  getEarnings:     ()       => API.get('/doctors/earnings/me'),
  toggleAccepting: ()       => API.put('/doctors/toggle-accepting'),
  addReview:       (id,data)=> API.post(`/doctors/${id}/reviews`, data),
}

// ─── Appointments ─────────────────────────────────────
export const appointmentAPI = {
  book:        (data)   => API.post('/appointments', data),
  getMy:       (params) => API.get('/appointments/my', { params }),
  getById:     (id)     => API.get(`/appointments/${id}`),
  cancel:      (id,data)=> API.put(`/appointments/${id}/cancel`, data),
  reschedule:  (id,data)=> API.put(`/appointments/${id}/reschedule`, data),
  getSlots:    (params) => API.get('/appointments/slots', { params }),
}

// ─── Payments ─────────────────────────────────────────
export const paymentAPI = {
  createOrder: (data) => API.post('/payments/create-order', data),
  verify:      (data) => API.post('/payments/verify', data),
  getHistory:  ()     => API.get('/payments/history'),
  getInvoice:  (id)   => API.get(`/payments/invoice/${id}`),
}

// ─── AI ───────────────────────────────────────────────
export const aiAPI = {
  chat:            (data) => API.post('/ai/chat', data),
  symptomCheck:    (data) => API.post('/ai/symptom-check', data),
  recommendDoctor: (data) => API.post('/ai/recommend-doctor', data),
  healthTips:      ()     => API.get('/ai/health-tips'),
}

// ─── Notifications ────────────────────────────────────
export const notificationAPI = {
  getAll:    ()   => API.get('/notifications'),
  markRead:  (id) => API.put(`/notifications/${id}/read`),
  markAllRead:()  => API.put('/notifications/read-all'),
  delete:    (id) => API.delete(`/notifications/${id}`),
}

// ─── Chat ─────────────────────────────────────────────
export const chatAPI = {
  getConversations: ()   => API.get('/chat/conversations'),
  getMessages:  (convId) => API.get(`/chat/${convId}`),
  send:         (data)   => API.post('/chat/send', data),
}

// ─── User ─────────────────────────────────────────────
export const userAPI = {
  getProfile:    ()     => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  uploadAvatar:  (data) => API.put('/users/avatar', data),
  getRecords:    ()     => API.get('/users/health-records'),
  uploadReport:  (data) => API.post('/users/reports', data),
}

// ─── Upload ───────────────────────────────────────────
export const uploadAPI = {
  upload: (formData) => API.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (publicId) => API.delete(`/upload/${publicId}`),
}

export default API
