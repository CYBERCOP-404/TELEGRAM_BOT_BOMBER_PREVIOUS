
import React, { useEffect, useRef } from 'react';
import { SendStatus } from '../types';
import { DEVELOPER_HANDLE } from '../constants';

interface CongratsViewProps {
  status: SendStatus;
  onReset: () => void;
}

const CongratsView: React.FC<CongratsViewProps> = ({ status, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 5 + 2,
        color: Math.random() > 0.5 ? '#00ff41' : '#00f3ff'
      });
    }

    let frameId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.y += p.speed;
        if (p.y > canvas.height) p.y = -10;
      });
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="text-center space-y-6">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40"></canvas>
      
      <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      
      <div>
        <h2 className="text-2xl font-black text-green-500 uppercase tracking-[0.2em] glitch-text">
          Target Compromised
        </h2>
        <p className="text-[10px] text-green-700 font-bold mt-1 uppercase tracking-widest">Operation Success: Logs Cleared</p>
      </div>

      <div className="bg-black/50 border border-green-500/20 p-4 rounded text-left font-mono text-[11px] space-y-2">
        <div className="flex justify-between">
          <span className="text-green-900">Total_Nodes:</span>
          <span className="text-green-500">{status.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-900">Packets_Sent:</span>
          <span className="text-green-400 font-bold">{status.sent}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-900">Drops_Fail:</span>
          <span className="text-red-500">{status.failed}</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 bg-green-500 text-black font-black uppercase tracking-widest border-2 border-green-500 hover:bg-transparent hover:text-green-500 transition-all"
      >
        [ NEW MISSION ]
      </button>
      
      <p className="text-[9px] text-green-900 uppercase font-black">
        Admin: <span className="text-green-600">{DEVELOPER_HANDLE}</span>
      </p>
    </div>
  );
};

export default CongratsView;
