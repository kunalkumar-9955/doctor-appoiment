import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [socket, setSocket]             = useState(null)
  const [onlineUsers, setOnlineUsers]   = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      withCredentials: true,
      auth: { token: localStorage.getItem('mc_token') },
    })

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected:', newSocket.id)
      newSocket.emit('join', user._id)
    })

    newSocket.on('user_online', ({ userId, online }) => {
      setOnlineUsers(prev =>
        online ? [...new Set([...prev, userId])] : prev.filter(id => id !== userId)
      )
    })

    newSocket.on('new_appointment', (data) => {
      setNotifications(prev => [{
        id: Date.now(), type: 'appointment', message: 'New appointment booked', data, read: false
      }, ...prev])
    })

    newSocket.on('appointment_updated', (data) => {
      setNotifications(prev => [{
        id: Date.now(), type: 'update', message: data.message, data, read: false
      }, ...prev])
    })

    newSocket.on('disconnect', () => console.log('🔌 Socket disconnected'))

    setSocket(newSocket)
    return () => { newSocket.disconnect() }
  }, [isAuthenticated, user?._id])

  const isUserOnline = (userId) => onlineUsers.includes(userId)
  const clearNotifications = () => setNotifications([])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, notifications, isUserOnline, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  )
}
