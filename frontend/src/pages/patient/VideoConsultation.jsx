import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  MessageSquare, Maximize, Settings, Activity,
  HeartPulse, Thermometer, Droplet
} from 'lucide-react';

const VideoConsultation = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Simulate Vitals
  const [vitals, setVitals] = useState({ hr: 72, temp: 98.6, bp: '120/80' });

  useEffect(() => {
    const timer = setInterval(() => setCallDuration(c => c + 1), 1000);
    
    // Simulate real-time vital changes
    const vitalsTimer = setInterval(() => {
      setVitals({
        hr: 70 + Math.floor(Math.random() * 5),
        temp: 98.6 + (Math.random() * 0.4 - 0.2),
        bp: `${118 + Math.floor(Math.random() * 5)}/${78 + Math.floor(Math.random() * 4)}`
      });
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(vitalsTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col overflow-hidden relative font-sans">
      
      {/* MAIN DOCTOR VIDEO FEED (Simulated with a highly premium gradient/image overlay) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=2000" 
          alt="Doctor feed" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        {/* Animated Scanning Effect */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-32 bg-gradient-to-b from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 blur-md pointer-events-none"
        />
      </div>

      {/* TOP HEADER */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <div className="flex items-center space-x-4 bg-gray-900/60 backdrop-blur-xl p-3 rounded-2xl border border-gray-700/50">
          <div className="relative">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-12 h-12 rounded-full bg-cyan-900/50" alt="Doctor" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Dr. Sarah Jenkins</h2>
            <div className="flex items-center text-cyan-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
              LIVE • {formatTime(callDuration)}
            </div>
          </div>
        </div>

        {/* VITALS HUD (Heads Up Display) */}
        <div className="flex space-x-3">
          <VitalCard icon={<HeartPulse size={18} className="text-rose-400"/>} label="Heart Rate" value={`${vitals.hr} bpm`} />
          <VitalCard icon={<Activity size={18} className="text-cyan-400"/>} label="Blood Pressure" value={vitals.bp} />
          <VitalCard icon={<Thermometer size={18} className="text-amber-400"/>} label="Temp" value={`${vitals.temp.toFixed(1)}°F`} />
        </div>
      </div>

      {/* PICTURE IN PICTURE (User Feed) */}
      <motion.div 
        drag 
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        className="absolute top-24 right-6 w-48 h-64 bg-gray-800 rounded-2xl border-2 border-gray-600/50 overflow-hidden z-20 shadow-2xl cursor-move"
      >
        {!isVideoOff ? (
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500" 
            alt="User feed" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xl font-bold">You</div>
          </div>
        )}
        {isMuted && (
          <div className="absolute bottom-2 right-2 bg-red-500 p-1.5 rounded-full">
            <MicOff size={14} className="text-white" />
          </div>
        )}
      </motion.div>

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center space-x-6 bg-gray-900/80 backdrop-blur-2xl px-8 py-4 rounded-full border border-gray-700/50 shadow-2xl shadow-cyan-900/20">
          
          <ControlButton 
            icon={isMuted ? <MicOff size={24}/> : <Mic size={24}/>} 
            isActive={isMuted}
            onClick={() => setIsMuted(!isMuted)}
            color={isMuted ? "bg-red-500/20 text-red-500" : "bg-gray-800 text-white hover:bg-gray-700"}
          />
          
          <ControlButton 
            icon={isVideoOff ? <VideoOff size={24}/> : <Video size={24}/>} 
            isActive={isVideoOff}
            onClick={() => setIsVideoOff(!isVideoOff)}
            color={isVideoOff ? "bg-red-500/20 text-red-500" : "bg-gray-800 text-white hover:bg-gray-700"}
          />
          
          <button className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95">
            <PhoneOff size={28} />
          </button>

          <ControlButton 
            icon={<MessageSquare size={24}/>} 
            isActive={showChat}
            onClick={() => setShowChat(!showChat)}
            color={showChat ? "bg-cyan-500/20 text-cyan-400" : "bg-gray-800 text-white hover:bg-gray-700"}
          />

          <ControlButton 
            icon={<Settings size={24}/>} 
            onClick={() => {}}
            color="bg-gray-800 text-white hover:bg-gray-700"
          />
        </div>
      </div>

      {/* CHAT SIDEBAR OVERLAY */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-0 bottom-0 w-96 bg-gray-900/95 backdrop-blur-3xl border-l border-gray-800 z-30 flex flex-col"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Live Consultation Chat</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <ChatMessage isDoctor text="Hello Kunal, I'm reviewing your latest AI Health Scan." />
              <ChatMessage isDoctor text="Your vitals look stable, but we need to discuss your cholesterol levels." />
              <ChatMessage text="Sure doctor, what should I do?" />
              <ChatMessage isDoctor text="I will upload an e-prescription with a diet plan right after this call." />
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-5 text-white focus:outline-none focus:border-cyan-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                  ➤
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VitalCard = ({ icon, label, value }) => (
  <div className="bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-700/50 flex flex-col items-center">
    <div className="flex items-center space-x-2 mb-1">
      {icon}
      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-white font-bold text-lg">{value}</span>
  </div>
);

const ControlButton = ({ icon, color, onClick, isActive }) => (
  <button 
    onClick={onClick}
    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${color}`}
  >
    {icon}
  </button>
);

const ChatMessage = ({ text, isDoctor = false }) => (
  <div className={`flex ${isDoctor ? 'justify-start' : 'justify-end'}`}>
    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
      isDoctor 
        ? 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700' 
        : 'bg-cyan-600 text-white rounded-tr-none'
    }`}>
      <p className="text-sm">{text}</p>
    </div>
  </div>
);

export default VideoConsultation;
