import React from "react";
import { ScoutingReport, GridTeamData } from "../types";
import {
    Target,
    ShieldAlert,
    Zap,
    Play,
    AlertTriangle,
    Users,
} from "lucide-react";

interface IntelViewProps {
    report: ScoutingReport;
    gridData: GridTeamData | null;
}

const IntelView: React.FC<IntelViewProps> = ({ report }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-widest uppercase glow-text-magenta header-font mb-2">
                    CLASSIFIED_INTEL
                </h1>
                <p className="text-sm text-gray-500 font-medium mono">
                    Tactical insights and composition analysis for <span className="text-[#ff00ff]">{report.teamName}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tactical Insights Panel */}
                <div className="glass-panel p-8 bracket-container bg-black/20">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-[#ff00ff] uppercase tracking-widest mono header-font glow-text-magenta flex items-center gap-2">
                            <ShieldAlert size={18} />
                            TACTICAL_INSIGHTS
                        </h3>
                        <AlertTriangle size={18} className="text-[#ff00ff] flicker" />
                    </div>
                    <div className="space-y-5">
                        {(report.tacticalInsights.weaknesses || []).length > 0 ? (
                            report.tacticalInsights.weaknesses.map((w, i) => (
                                <div
                                    key={i}
                                    className="p-5 bg-[#ff00ff]/5 border border-[#ff00ff]/20 hover:border-[#ff00ff]/40 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-xs font-black text-[#ff00ff] uppercase mono">
                                            TACTICAL_FLAW_0{i + 1}
                                        </div>
                                        <div className="text-[10px] font-black text-[#00ff88] mono glow-text-cyan">
                                            DETECTED
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-300 mono leading-relaxed">
                                        {w}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mono p-4 bg-black/40 border border-white/5">
                                No weaknesses found in current dataset.
                            </div>
                        )}
                    </div>
                </div>

                {/* Specific Counters Panel */}
                <div className="glass-panel p-8 bracket-container bg-black/20">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-[#00d4ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <Zap size={18} />
                            SPECIFIC_COUNTERS
                        </h3>
                        <Target size={18} className="text-[#00d4ff]" />
                    </div>
                    <div className="space-y-5">
                        {(report.tacticalInsights.strengths || []).map((strength, idx) => (
                            <div
                                key={idx}
                                className="p-5 bg-black/40 border-l-2 border-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors"
                            >
                                <Target size={16} className="text-[#00d4ff] mb-3" />
                                <p className="text-sm font-medium text-gray-300 mono leading-relaxed">
                                    {strength}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preferred Compositions */}
            <div className="glass-panel p-8 bracket-container bg-black/20">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mono header-font flex items-center gap-2">
                        <Users size={18} />
                        PREF_COMP_SETS
                    </h3>
                    <Play size={18} className="text-[#00d4ff]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {report.topCompositions.map((comp, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col gap-5 p-6 bg-black/60 border border-white/5 hover:border-[#00d4ff]/30 transition-all group"
                        >
                            <div className="flex -space-x-3">
                                {comp.agents.map((a, i) => (
                                    <div
                                        key={i}
                                        className="w-16 h-12 border border-[#00d4ff]/20 bg-zinc-950 flex items-center justify-center text-xs font-black text-white uppercase mono leading-none group-hover:translate-y-[-2px] transition-all"
                                    >
                                        {a.slice(0, 2)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-black uppercase text-[#00d4ff] mono tracking-widest">
                                        {comp.playStyle}
                                    </span>
                                    <span className="text-xs font-black text-[#00ff88] mono glow-text-cyan">
                                        {comp.winRate}%_WR
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 overflow-hidden rounded-full">
                                    <div
                                        ref={(el) => {
                                            if (el) {
                                                el.style.setProperty('--progress-width', `${comp.winRate}%`);
                                            }
                                        }}
                                        className="h-full bg-[#00d4ff] glow-cyan progress-bar"
                                    ></div>
                                </div>
                                <div className="text-[10px] text-gray-600 font-black uppercase mono mt-3">
                                    {comp.occurrence}% occurrence
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IntelView;
