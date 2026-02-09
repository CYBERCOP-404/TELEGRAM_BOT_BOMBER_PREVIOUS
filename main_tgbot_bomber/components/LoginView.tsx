
import React, { useState } from 'react';
import { UserCredentials } from '../types';

interface LoginViewProps {
  onLogin: (creds: UserCredentials) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) return;
    setLoading(true);
    onLogin({ token, userId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-green-500/70 uppercase tracking-widest ml-1 flex justify-between">
          <span>Target Token</span>
          <span className="animate-pulse">_</span>
        </label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="0000000000:ABC..."
          className="w-full px-4 py-3 rounded bg-green-400 text-black font-bold border-2 border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-green-500/70 uppercase tracking-widest ml-1">
          Target User ID
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="53164..."
          className="w-full px-4 py-3 rounded bg-green-400 text-black font-bold border-2 border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 mt-2 bg-black border-2 border-green-500 text-green-500 font-black uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all group overflow-hidden relative ${loading ? 'opacity-50' : ''}`}
      >
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-white/20 -skew-x-12"></div>
        {loading ? "INITIALIZING..." : "> EXECUTE ACCESS"}
      </button>
      
      <div className="bg-green-500/5 p-3 rounded border border-green-500/10">
        <p className="text-[9px] text-green-700 leading-tight">
          [!] INJECTING PAYLOAD...<br/>
          [!] ENCRYPTING TUNNEL...<br/>
          [!] BYPASSING PROTOCOL 404...
        </p>
      </div>
    </form>
  );
};

export default LoginView;
