import React, { useState } from "react";
import { ScoutingReport, GridTeamData } from "../types";
import {
    Users,
    Code,
    ChevronDown,
    ChevronUp,
    Database,
    Activity,
} from "lucide-react";

interface MetricsViewProps {
    report: ScoutingReport;
    gridData: GridTeamData | null;
    onSearch?: (name: string) => void;
}

const MetricsView: React.FC<MetricsViewProps> = ({ report, gridData, onSearch }) => {
    const [showRawTelemetry, setShowRawTelemetry] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-widest uppercase glow-text-cyan header-font mb-2">
                    PERFORMANCE_METRICS
                </h1>
                <p className="text-sm text-gray-500 font-medium mono">
                    Entity performance data for <span className="text-[#00d4ff]">{report.teamName}</span>
                </p>
            </div>

            {/* Player Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 bracket-container bg-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[#ff00ff] uppercase tracking-widest mono header-font glow-text-magenta flex items-center gap-2">
                            <Users size={16} />
                            ENTITY_STATS
                        </h3>
                        <Activity size={16} className="text-[#ff00ff] flicker" />
                    </div>
                    <div className="space-y-4">
                        {report.playerProfiles.map((player, idx) => (
                            <div
                                key={idx}
                                onClick={() => onSearch?.(player.name)}
                                className="flex justify-between items-center p-4 bg-white/5 border border-white/5 hover:border-[#ff00ff] hover:bg-white/10 transition-all cursor-pointer group relative"
                                title={`Index ${player.name}`}
                            >
                                <div>
                                    <div className="text-sm font-black text-white uppercase mono">
                                        {player.name}
                                    </div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mono">
                                        {player.role}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        {player.mostPlayed.slice(0, 3).map((agent, i) => (
                                            <span
                                                key={i}
                                                className="text-[8px] px-2 py-0.5 bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] font-black uppercase"
                                            >
                                                {agent}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-[#ff00ff] mono">
                                        {player.kda}
                                    </div>
                                    <div className="text-[8px] text-gray-600 font-black uppercase mono">
                                        KDA
                                    </div>
                                    {player.winRate && (
                                        <div className="text-[10px] text-[#00ff88] font-black mono mt-1">
                                            {player.winRate}% WR
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Player Tendencies */}
                <div className="glass-panel p-6 bracket-container bg-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[#00d4ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <Activity size={16} />
                            BEHAVIORAL_PATTERNS
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {report.playerProfiles.map((player, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-black/40 border-l-2 border-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors"
                            >
                                <div className="text-[10px] font-black text-[#00d4ff] uppercase mono mb-2">
                                    {player.name}
                                </div>
                                <p className="text-[11px] font-bold text-gray-300 mono italic">
                                    {player.tendency || "Standard playstyle, no notable patterns detected."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Raw Telemetry Feed */}
            <div className="mt-8">
                <button
                    onClick={() => setShowRawTelemetry(!showRawTelemetry)}
                    className="w-full p-4 glass-panel border-white/10 flex items-center justify-between group hover:border-[#00d4ff]/50 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <Code size={18} className="text-[#00d4ff]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-white mono transition-colors">
                            RAW_TELEMETRY_FEED
                        </span>
                    </div>
                    {showRawTelemetry ? (
                        <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                    )}
                </button>

                {showRawTelemetry && (
                    <div className="mt-2 p-6 bg-black/80 border border-white/5 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 mb-4">
                            <Database size={14} className="text-[#00d4ff]" />
                            <span className="text-[10px] font-black uppercase text-[#00d4ff] mono">
                                GRID_API_OBJECT_INGRESS
                            </span>
                        </div>
                        <pre className="text-[10px] text-gray-400 font-mono overflow-x-auto p-4 bg-black/50 border border-white/5 custom-scrollbar max-h-96">
                            {JSON.stringify(gridData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricsView;
