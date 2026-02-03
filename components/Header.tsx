
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-8 flex items-center justify-between border-b border-white/10 glass-card sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 c9-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-current">
            <path d="M50 45 L42 58 L50 75 L58 58 Z" />
            <path d="M42 58 L15 30 C12 40 25 60 38 72 Z" />
            <path d="M58 58 L85 30 C88 40 75 60 62 72 Z" />
            <path d="M50 45 L50 32 L44 43 L50 45 Z" />
            <path d="M50 45 L50 32 L56 43 L50 45 Z" />
            <path d="M50 90 L40 78 L50 82 L60 78 Z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Omni<span className="text-[#00AEEF]">Scout</span></h1>
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Lead Analyst Terminal</p>
        </div>
      </div>
      <nav className="flex items-center gap-8">
        <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">DASHBOARD</span>
        <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">HISTORICAL ARCHIVE</span>
        <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">GRID CONNECT</span>
        <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-blue-400 font-bold uppercase">LIVE FEED</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
