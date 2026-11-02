import React, { useState, useEffect, useRef } from 'react'
import { chatAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { Send, MessageSquare, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function PatientChat() {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [conversations, setConversations] = useState([])
  const [active, setActive]   = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    chatAPI.getConversations().then(r => setConversations(r.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!active) return
    const otherId = active.sender?._id === user?._id ? active.receiver?._id : active.sender?._id
    const convId  = [user._id, otherId].sort().join('_')
    chatAPI.getMessages(convId).then(r => setMessages(r.data.data || [])).catch(() => {})
  }, [active])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    if (!socket) return
    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })
    return () => socket.off('new_message')
  }, [socket])

  const getOther = (conv) => conv.sender?._id === user?._id ? conv.receiver : conv.sender

  const sendMessage = async () => {
    if (!input.trim() || !active) return
    const otherId = getOther(active)?._id
    setLoading(true)
    try {
      await chatAPI.send({ receiverId: otherId, message: input })
      setInput('')
    } catch {} finally { setLoading(false) }
  }

  return (
    <div className="h-[75vh] flex gap-0 glass-card overflow-hidden rounded-2xl">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-100 dark:border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary-500" />Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">No conversations yet</div>
          ) : conversations.map(conv => {
            const other = getOther(conv)
            return (
              <div key={conv._id} onClick={() => setActive(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${active?._id === conv._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                  {other?.avatar?.url ? <img src={other.avatar.url} className="w-full h-full object-cover" /> : other?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{other?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{conv.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!active ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-3 text-slate-400">
            <MessageSquare className="w-16 h-16 opacity-30" />
            <p className="font-medium">Select a conversation</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                {getOther(active)?.avatar?.url ? <img src={getOther(active).avatar.url} className="w-full h-full object-cover" /> : getOther(active)?.name?.[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-white">{getOther(active)?.name}</p>
                <p className="text-xs text-green-500 font-medium">Online</p>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => {
                const isMine = msg.sender?._id === user?._id || msg.sender === user?._id
                return (
                  <div key={i} className={`flex ${isMine ? 'flex-row-reverse' : ''} gap-2`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'}`}>
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-1 ${isMine ? 'text-white/70' : 'text-slate-400'}`}>{format(new Date(msg.createdAt), 'HH:mm')}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            {/* Input */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..." className="input-field flex-1 text-sm" />
              <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-primary px-4 py-3 disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
