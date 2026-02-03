import React from "react";
import { ComparisonReport } from "../comparisonService";
import {
    ShieldAlert,
    Target,
    Zap,
    AlertTriangle,
    TrendingUp,
    Lightbulb,
    Users,
    Play,
    Crosshair,
    Brain,
} from "lucide-react";

interface VSIntelViewProps {
    comparison: ComparisonReport;
}

const VSIntelView: React.FC<VSIntelViewProps> = ({ comparison }) => {
    const { team1, team2, headToHead } = comparison;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-widest uppercase glow-text-magenta header-font mb-2">
                    VS_INTEL
                </h1>
                <p className="text-sm text-gray-500 font-medium mono">
                    Tactical intelligence comparison: <span className="text-[#00d4ff]">{team1.name}</span> vs <span className="text-[#ff00ff]">{team2.name}</span>
                </p>
            </div>

            {/* Key Matchups - Coach Priority */}
            <div className="glass-panel p-6 bracket-container bg-[#ff00ff]/5 border-[#ff00ff]/30">
                <div className="flex items-center gap-3 mb-6">
                    <Crosshair size={20} className="text-[#ff00ff]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        KEY_MATCHUPS
                    </h3>
                    <span className="ml-auto text-[9px] text-[#ff00ff] mono bg-[#ff00ff]/10 px-2 py-0.5 border border-[#ff00ff]/30">
                        COACH_PRIORITY
                    </span>
                </div>
                <div className="space-y-3">
                    {headToHead.keyMatchups.map((matchup, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 hover:border-[#ff00ff]/30 transition-all">
                            <Zap size={16} className="text-[#00d4ff] shrink-0" />
                            <span className="text-sm text-gray-300 mono">{matchup}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Entity 1 Strengths */}
                <div className="glass-panel p-6 bracket-container bg-black/20 border-[#00d4ff]/30">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[#00d4ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <TrendingUp size={16} />
                            {team1.name}_STRENGTHS
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {(team1.report.tacticalInsights.strengths || []).map((strength, idx) => (
                            <div key={idx} className="p-3 bg-[#00d4ff]/5 border-l-2 border-[#00d4ff]">
                                <p className="text-sm text-gray-300 mono leading-relaxed">{strength}</p>
                            </div>
                        ))}
                        {headToHead.advantageAreas.team1.map((adv, idx) => (
                            <div key={`adv-${idx}`} className="flex items-center gap-2 p-3 bg-[#00ff88]/5 border border-[#00ff88]/20">
                                <TrendingUp size={14} className="text-[#00ff88]" />
                                <span className="text-sm text-[#00ff88] font-black mono uppercase">{adv}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Entity 2 Strengths */}
                <div className="glass-panel p-6 bracket-container bg-black/20 border-[#ff00ff]/30">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[#ff00ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <TrendingUp size={16} />
                            {team2.name}_STRENGTHS
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {(team2.report.tacticalInsights.strengths || []).map((strength, idx) => (
                            <div key={idx} className="p-3 bg-[#ff00ff]/5 border-l-2 border-[#ff00ff]">
                                <p className="text-sm text-gray-300 mono leading-relaxed">{strength}</p>
                            </div>
                        ))}
                        {headToHead.advantageAreas.team2.map((adv, idx) => (
                            <div key={`adv-${idx}`} className="flex items-center gap-2 p-3 bg-[#00ff88]/5 border border-[#00ff88]/20">
                                <TrendingUp size={14} className="text-[#00ff88]" />
                                <span className="text-sm text-[#00ff88] font-black mono uppercase">{adv}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weaknesses - Exploitable Gaps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Entity 1 Weaknesses */}
                <div className="glass-panel p-6 bracket-container bg-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[#ff00ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {team1.name}_EXPLOITS
                        </h3>
                        <ShieldAlert size={16} className="text-[#ff00ff] flicker" />
                    </div>
                    <div className="space-y-3">
                        {(team1.report.tacticalInsights.weaknesses || []).map((weakness, idx) => (
                            <div key={idx} className="p-4 bg-[#ff00ff]/5 border border-[#ff00ff]/20">
                                <div className="flex items-start gap-3">
                                    <Target size={14} className="text-[#ff00ff] mt-1 shrink-0" />
                                    <p className="text-sm text-gray-300 mono leading-relaxed">{weakness}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {team1.report.tacticalInsights.weaknesses && team1.report.tacticalInsights.weaknesses.length > 0 && (
                        <div className="mt-4 p-3 bg-[#00ff88]/10 border border-[#00ff88]/30">
                            <div className="text-[10px] font-black text-[#00ff88] uppercase mono mb-1">
                                HOW_{team2.name}_CAN_WIN
                            </div>
                            <p className="text-xs text-gray-400 mono italic">
                                Exploit {team1.name}'s tendency toward {team1.report.tacticalInsights.weaknesses[0]?.split(" ").slice(0, 3).join(" ")}...
                            </p>
                        </div>
                    )}
                </div>

                {/* Entity 2 Weaknesses */}
                <div className="glass-panel p-6 bracket-container bg-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[#ff00ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {team2.name}_EXPLOITS
                        </h3>
                        <ShieldAlert size={16} className="text-[#ff00ff] flicker" />
                    </div>
                    <div className="space-y-3">
                        {(team2.report.tacticalInsights.weaknesses || []).map((weakness, idx) => (
                            <div key={idx} className="p-4 bg-[#ff00ff]/5 border border-[#ff00ff]/20">
                                <div className="flex items-start gap-3">
                                    <Target size={14} className="text-[#ff00ff] mt-1 shrink-0" />
                                    <p className="text-sm text-gray-300 mono leading-relaxed">{weakness}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {team2.report.tacticalInsights.weaknesses && team2.report.tacticalInsights.weaknesses.length > 0 && (
                        <div className="mt-4 p-3 bg-[#00ff88]/10 border border-[#00ff88]/30">
                            <div className="text-[10px] font-black text-[#00ff88] uppercase mono mb-1">
                                HOW_{team1.name}_CAN_WIN
                            </div>
                            <p className="text-xs text-gray-400 mono italic">
                                Exploit {team2.name}'s tendency toward {team2.report.tacticalInsights.weaknesses[0]?.split(" ").slice(0, 3).join(" ")}...
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Win Conditions Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 bracket-container bg-[#00d4ff]/5 border-[#00d4ff]/30">
                    <div className="flex items-center gap-3 mb-4">
                        <Lightbulb size={18} className="text-[#00d4ff]" />
                        <h3 className="text-sm font-black text-[#00d4ff] uppercase tracking-widest mono">
                            {team1.name}_WIN_CONDITION
                        </h3>
                    </div>
                    <p className="text-sm text-gray-300 mono leading-relaxed">
                        {team1.report.tacticalInsights.howToWin || "Maintain standard protocols and exploit opponent weaknesses."}
                    </p>
                </div>

                <div className="glass-panel p-6 bracket-container bg-[#ff00ff]/5 border-[#ff00ff]/30">
                    <div className="flex items-center gap-3 mb-4">
                        <Lightbulb size={18} className="text-[#ff00ff]" />
                        <h3 className="text-sm font-black text-[#ff00ff] uppercase tracking-widest mono">
                            {team2.name}_WIN_CONDITION
                        </h3>
                    </div>
                    <p className="text-sm text-gray-300 mono leading-relaxed">
                        {team2.report.tacticalInsights.howToWin || "Maintain standard protocols and exploit opponent weaknesses."}
                    </p>
                </div>
            </div>

            {/* Composition Analysis */}
            <div className="glass-panel p-6 bracket-container bg-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <Users size={20} className="text-[#00ff88]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        COMPOSITION_OVERLAP
                    </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Entity 1 Comps */}
                    <div>
                        <div className="text-[10px] font-black text-[#00d4ff] uppercase mono mb-3">{team1.name} PREFERRED</div>
                        <div className="space-y-3">
                            {team1.report.topCompositions.slice(0, 2).map((comp, idx) => (
                                <div key={idx} className="p-3 bg-black/40 border border-white/5">
                                    <div className="flex -space-x-2 mb-2">
                                        {comp.agents.map((a, i) => (
                                            <div key={i} className="w-8 h-8 border border-[#00d4ff]/20 bg-zinc-950 flex items-center justify-center text-[8px] font-black text-white uppercase">
                                                {a.slice(0, 2)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] text-[#00d4ff] font-black mono uppercase">{comp.playStyle}</span>
                                        <span className="text-[9px] text-[#00ff88] font-black mono">{comp.winRate}% WR</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Entity 2 Comps */}
                    <div>
                        <div className="text-[10px] font-black text-[#ff00ff] uppercase mono mb-3">{team2.name} PREFERRED</div>
                        <div className="space-y-3">
                            {team2.report.topCompositions.slice(0, 2).map((comp, idx) => (
                                <div key={idx} className="p-3 bg-black/40 border border-white/5">
                                    <div className="flex -space-x-2 mb-2">
                                        {comp.agents.map((a, i) => (
                                            <div key={i} className="w-8 h-8 border border-[#ff00ff]/20 bg-zinc-950 flex items-center justify-center text-[8px] font-black text-white uppercase">
                                                {a.slice(0, 2)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] text-[#ff00ff] font-black mono uppercase">{comp.playStyle}</span>
                                        <span className="text-[9px] text-[#00ff88] font-black mono">{comp.winRate}% WR</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Counter-Pick Recommendations */}
            <div className="glass-panel p-6 bracket-container bg-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <Brain size={20} className="text-[#00d4ff]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        COUNTER_DRAFT_RECOMMENDATIONS
                    </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 bg-black/40 border-l-2 border-[#00d4ff]">
                        <div className="text-[10px] font-black text-[#00d4ff] uppercase mono mb-3">
                            IF_PLAYING_AS_{team1.name}
                        </div>
                        <div className="space-y-2">
                            {(team1.report.tacticalInsights.counterPicks || ["Prioritize early aggression", "Target weak flanks", "Force eco rounds"]).slice(0, 3).map((pick, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-300 mono">
                                    <Play size={12} className="text-[#00d4ff]" />
                                    {pick}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-black/40 border-l-2 border-[#ff00ff]">
                        <div className="text-[10px] font-black text-[#ff00ff] uppercase mono mb-3">
                            IF_PLAYING_AS_{team2.name}
                        </div>
                        <div className="space-y-2">
                            {(team2.report.tacticalInsights.counterPicks || ["Control mid tempo", "Deny vision", "Stack bomb sites"]).slice(0, 3).map((pick, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-300 mono">
                                    <Play size={12} className="text-[#ff00ff]" />
                                    {pick}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VSIntelView;
