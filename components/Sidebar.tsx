import React from 'react';
import { 
  LayoutDashboard, 
  Eye, 
  Users, 
  Database, 
  Settings, 
  LogOut, 
  BarChart3, 
  Activity, 
  PanelLeft, 
  ShieldAlert, 
  Cpu 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onSystemAction: (action: string) => void;
}

/**
 * Tactical Hex-Core Logo: A clean, geometric representation of a radar hub or tactical core.
 * Uses CSS variables for flexible theming.
 */
export const TacticalLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Hexagon Frame */}
    <path 
      d="M50 5 L90 25 V75 L50 95 L10 75 V25 L50 5Z" 
      stroke="var(--logo-primary, white)" 
      strokeWidth="2" 
      strokeLinejoin="round" 
    />
    {/* Inner Fragmented Hexagon */}
    <path 
      d="M50 20 L75 35 V65 L50 80 L25 65 V35 L50 20Z" 
      fill="var(--logo-accent, #00d4ff)" 
      fillOpacity="0.2" 
      stroke="var(--logo-accent, #00d4ff)" 
      strokeWidth="1.5" 
    />
    {/* Central Core Pulse */}
    <path 
      d="M50 40 L60 45 V55 L50 60 L40 55 V45 L50 40Z" 
      fill="var(--logo-primary, white)" 
      className="flicker"
    />
    {/* Compass / Targeting lines */}
    <path 
      d="M50 5 V15 M50 85 V95 M10 25 L18 29 M82 71 L90 75 M10 75 L18 71 M82 29 L90 25" 
      stroke="var(--logo-primary, white)" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, currentView, onNavigate, onSystemAction }) => {
  return (
    <aside className={`border-r border-white/5 flex flex-col h-screen glass-panel relative z-[60] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-64'}`}>
      
      {/* Header Section: Logo on left, Toggle on right */}
      <div className={`h-20 flex items-center transition-all duration-300 px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div 
            className="flex items-center gap-3 animate-in fade-in duration-500 cursor-pointer"
            onClick={() => onNavigate('SCOUT')}
          >
            {/* Boxed Tactical Logo */}
            <div className="w-10 h-10 flex items-center justify-center relative rounded-lg bg-black/40 border border-white/10 overflow-hidden shadow-inner group">
               <TacticalLogo className="w-7 h-7 drop-shadow-[0_0_8px_var(--logo-accent-glow,rgba(0,212,255,0.4))] group-hover:scale-110 transition-transform" />
            </div>
            <span className="header-font font-black italic text-lg tracking-widest text-white glow-text-cyan">OS_<span className="text-[#00d4ff]">CMD</span></span>
          </div>
        )}

        <button 
          onClick={onToggle} 
          className={`p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-[#00d4ff]/30 transition-all active:scale-90 group relative`}
          title={isCollapsed ? "Expand Command Hub" : "Collapse Command Hub"}
        >
          <PanelLeft size={22} className="text-gray-400 group-hover:text-[#00d4ff] transition-colors" />
        </button>
      </div>

      {/* Navigation Rail */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-4 no-scrollbar ${isCollapsed ? 'px-1' : 'px-3'}`}>
        {!isCollapsed && (
          <p className="px-4 text-[9px] header-font font-black text-gray-500 uppercase tracking-[0.4em] mb-4 mono opacity-40">Tactical_Vector</p>
        )}
        
        <SidebarItem 
          icon={<Eye size={20} />} 
          label="Scout" 
          active={currentView === 'SCOUT'}
          onClick={() => onNavigate('SCOUT')}
          isCollapsed={isCollapsed} 
        />
        <SidebarItem 
          icon={<Activity size={20} />} 
          label="Telemetry" 
          active={currentView === 'TELEMETRY'}
          onClick={() => onNavigate('TELEMETRY')}
          isCollapsed={isCollapsed} 
        />
        <SidebarItem 
          icon={<BarChart3 size={20} />} 
          label="Metrics" 
          active={currentView === 'METRICS'}
          onClick={() => onNavigate('METRICS')}
          isCollapsed={isCollapsed} 
        />
        <SidebarItem 
          icon={<Users size={20} />} 
          label="Intel" 
          active={currentView === 'INTEL'}
          onClick={() => onNavigate('INTEL')}
          isCollapsed={isCollapsed} 
        />
      </nav>

      {/* Footer / Status */}
      <div className="p-4 flex flex-col gap-2">
        {isCollapsed ? (
          <div className="w-10 h-10 mx-auto bg-black flex items-center justify-center text-[#ff00ff] border border-[#ff00ff]/30 group cursor-pointer flicker glow-magenta hover:border-[#ff00ff] transition-all" onClick={() => onSystemAction('SYSTEM_REBOOT')}>
             <ShieldAlert size={18} className="tech-spin"/>
          </div>
        ) : (
          <div className="p-4 w-full bg-black/40 border border-[#00d4ff]/20 relative overflow-hidden group bracket-container">
            <div className="absolute top-0 right-0 w-full h-full striped-bg opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <div className="w-1.5 h-1.5 bg-[#00ff88] absolute top-2 right-2 animate-pulse shadow-[0_0_10px_#00ff88]"></div>
            <p className="relative z-10 text-[9px] header-font font-black text-[#00d4ff] mb-1 uppercase tracking-widest mono">Node_Link: OK</p>
            <p className="relative z-10 text-[8px] text-gray-600 mb-3 leading-tight uppercase font-bold mono">Entropy: 0.0031</p>
            <button 
              className="relative z-10 w-full py-1.5 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-black rounded-none text-[9px] header-font font-black tracking-[0.2em] transition-all glow-cyan laser-btn"
              onClick={() => onSystemAction('SYSTEM_REBOOT')}
            >
              REBOOT
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
  isCollapsed: boolean;
}> = ({ icon, label, active, onClick, isCollapsed }) => (
  <button 
    onClick={onClick}
    className={`w-full flex transition-all relative group ${
      isCollapsed 
        ? 'flex-col items-center justify-center py-4 px-0 h-auto gap-1' 
        : 'flex-row items-center gap-4 px-4 py-2.5 h-11'
    } border border-transparent ${
      active ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/20 glow-cyan' : 'text-gray-400 hover:text-white hover:bg-white/5'
    } mb-1`}
  >
    <div className={`transition-all duration-300 ${active ? 'text-[#00d4ff]' : 'text-gray-400 group-hover:text-[#00d4ff]'}`}>
      {icon}
    </div>
    
    <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap tracking-[0.1em] header-font uppercase ${
      isCollapsed ? 'text-[8px] font-bold leading-none scale-90' : 'text-xs font-bold'
    }`}>
      {label}
    </span>

    {active && !isCollapsed && (
      <div className="absolute left-0 w-0.5 h-1/2 bg-[#00d4ff] shadow-[0_0_15px_#00d4ff]"></div>
    )}
  </button>
);

export default Sidebar;