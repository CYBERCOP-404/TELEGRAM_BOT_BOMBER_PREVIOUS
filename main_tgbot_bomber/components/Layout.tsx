
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-green-500/10 rounded border border-green-500/30 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-green-400">Restricted Access</span>
          </div>
          <h1 className="text-3xl font-bold text-green-500 uppercase tracking-tighter glitch-text">
            {title}
          </h1>
          <div className="h-1 w-24 bg-green-500/50 mx-auto mt-2 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 animate-[pulse_2s_infinite]"></div>
          </div>
        </div>
        
        <div className="bg-[#0f0f0f]/90 border border-green-500/20 rounded-lg shadow-[0_0_50px_rgba(0,255,65,0.1)] p-6 relative overflow-hidden backdrop-blur-xl">
          {/* Terminal corner details */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/50 m-2"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500/50 m-2"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500/50 m-2"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/50 m-2"></div>
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
        
        <p className="text-center text-green-900 mt-6 text-[10px] uppercase font-bold tracking-widest">
          Terminal Status: Online | CID: 5316471518
        </p>
      </div>
    </div>
  );
};

export default Layout;
