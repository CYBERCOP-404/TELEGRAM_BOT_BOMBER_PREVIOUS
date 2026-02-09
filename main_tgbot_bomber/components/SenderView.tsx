
import React, { useState } from 'react';
import { UserCredentials, SendStatus } from '../types';
import { sendMessageToUser } from '../services/telegramService';

interface SenderViewProps {
  credentials: UserCredentials;
  onFinished: (status: SendStatus) => void;
  onLogout: () => void;
}

const SenderView: React.FC<SenderViewProps> = ({ credentials, onFinished, onLogout }) => {
  const [message, setMessage] = useState('');
  const [count, setCount] = useState<number | string>('');
  const [status, setStatus] = useState<SendStatus>({ sent: 0, failed: 0, remaining: 0, total: 0 });
  const [isSending, setIsSending] = useState(false);
  const [notifs, setNotifs] = useState<{ id: number; text: string; success: boolean }[]>([]);

  const addNotif = (text: string, success: boolean) => {
    const id = Date.now();
    setNotifs(prev => [{ id, text, success }, ...prev].slice(0, 2)); // Limit to max 2
    setTimeout(() => {
      setNotifs(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleSend = async () => {
    const totalCount = parseInt(count.toString());
    if (!message || !totalCount || totalCount <= 0) return;

    setIsSending(true);
    let sentCount = 0;
    let failedCount = 0;
    
    setStatus({ sent: 0, failed: 0, remaining: totalCount, total: totalCount });

    for (let i = 0; i < totalCount; i++) {
      const success = await sendMessageToUser(credentials.token, credentials.userId, message);
      
      if (success) sentCount++; else failedCount++;

      setStatus({
        sent: sentCount,
        failed: failedCount,
        remaining: totalCount - (i + 1),
        total: totalCount
      });

      addNotif(`${success ? 'DATA SENT' : 'NODE FAIL'} [${i + 1}]`, success);
      await new Promise(r => setTimeout(r, 150));
    }

    setIsSending(false);
    setTimeout(() => {
      onFinished({ sent: sentCount, failed: failedCount, remaining: 0, total: totalCount });
    }, 800);
  };

  const progress = status.total > 0 ? (status.sent / status.total) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center border-b border-green-500/20 pb-2">
        <h3 className="text-xs font-black text-green-500 uppercase tracking-widest">Active Console</h3>
        <button 
          onClick={onLogout}
          className="text-[10px] font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-2 py-1 border border-red-500/20 rounded"
        >
          [ TERMINATE ]
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="SYSTEM_MESSAGE >> Input payload data..."
            rows={3}
            disabled={isSending}
            className="w-full px-4 py-3 rounded bg-green-400 text-black font-bold border-2 border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none resize-none transition-all"
          />
          <div className="absolute top-1 right-2 text-[8px] text-black/40 font-bold uppercase">Payload_Field</div>
        </div>
        
        <div className="relative">
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="CYCLES_COUNT >>"
            disabled={isSending}
            className="w-full px-4 py-3 rounded bg-green-400 text-black font-bold border-2 border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all"
          />
          <div className="absolute top-1 right-2 text-[8px] text-black/40 font-bold uppercase">Cycle_Field</div>
        </div>
        
        <button
          onClick={handleSend}
          disabled={isSending}
          className={`w-full py-4 bg-green-500 text-black font-black uppercase tracking-tighter shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:scale-[1.02] active:scale-95 transition-all ${isSending ? 'opacity-50 animate-pulse' : ''}`}
        >
          {isSending ? "> FLOODING NODES..." : "> INITIATE FLOOD"}
        </button>
      </div>

      <div className="pt-4 space-y-3">
        <div className="flex justify-between text-[10px] font-bold text-green-500 uppercase">
          <span>Flood Progress</span>
          <span className="animate-pulse">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-black border border-green-500/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 shadow-[0_0_10px_#00ff41]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black border border-green-500/20 p-2 rounded text-center">
            <div className="text-[8px] text-green-500/50 uppercase">Success</div>
            <div className="text-sm font-bold text-green-400">{status.sent}</div>
          </div>
          <div className="bg-black border border-green-500/20 p-2 rounded text-center">
            <div className="text-[8px] text-green-500/50 uppercase">Queue</div>
            <div className="text-sm font-bold text-blue-400">{status.remaining}</div>
          </div>
          <div className="bg-black border border-green-500/20 p-2 rounded text-center">
            <div className="text-[8px] text-green-500/50 uppercase">Errors</div>
            <div className="text-sm font-bold text-red-500">{status.failed}</div>
          </div>
        </div>
      </div>

      {/* Real-time floating notifications - Max 2, Glassy */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none w-48">
        {notifs.map(notif => (
          <div 
            key={notif.id}
            className={`px-3 py-2 rounded-lg border-l-4 glass-notif shadow-2xl text-[10px] font-bold uppercase tracking-widest transition-all transform animate-glitch-in flex items-center justify-between ${notif.success ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}
          >
            <span>{notif.text}</span>
            <span className="text-[8px] opacity-40">ACK</span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes glitch-in {
          0% { opacity: 0; transform: translateX(50px) skewX(20deg); }
          50% { transform: translateX(-5px) skewX(-10deg); }
          100% { opacity: 1; transform: translateX(0) skewX(0); }
        }
        .animate-glitch-in {
          animation: glitch-in 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SenderView;
