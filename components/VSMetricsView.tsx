import React from "react";
import { ComparisonReport } from "../comparisonService";
import {
    Users,
    Activity,
    Target,
    Swords,
    TrendingUp,
    TrendingDown,
    Award,
    Crosshair,
} from "lucide-react";

interface VSMetricsViewProps {
    comparison: ComparisonReport;
}

const VSMetricsView: React.FC<VSMetricsViewProps> = ({ comparison }) => {
    const { team1, team2, headToHead } = comparison;

    // Get players from both entities
    const players1 = team1.report.playerProfiles;
    const players2 = team2.report.playerProfiles;

    // Role mapping for matchups
    const roles = ["Duelist", "Initiator", "Controller", "Sentinel", "Flex", "IGL", "Mid", "ADC", "Support", "Jungle", "Top"];

    // Create role matchups
    const roleMatchups = roles.map(role => {
        const p1 = players1.find(p => p.role === role);
        const p2 = players2.find(p => p.role === role);
        if (p1 || p2) {
            return { role, player1: p1, player2: p2 };
        }
        return null;
    }).filter(Boolean);

    // Compare KDAs
    const parseKDA = (kda: string) => parseFloat(kda) || 1.0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-widest uppercase glow-text-cyan header-font mb-2">
                    VS_METRICS
                </h1>
                <p className="text-sm text-gray-500 font-medium mono">
                    Player performance comparison: <span className="text-[#00d4ff]">{team1.name}</span> vs <span className="text-[#ff00ff]">{team2.name}</span>
                </p>
            </div>

            {/* Side-by-Side Rosters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Entity 1 Roster */}
                <div className="glass-panel p-6 bracket-container bg-black/20 border-[#00d4ff]/30">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[#00d4ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <Users size={16} />
                            {team1.name}_ROSTER
                        </h3>
                        <Activity size={16} className="text-[#00d4ff] flicker" />
                    </div>
                    <div className="space-y-3">
                        {players1.map((player, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center p-3 bg-white/5 border border-white/5 hover:border-[#00d4ff]/30 transition-all"
                            >
                                <div>
                                    <div className="text-sm font-black text-white uppercase mono">{player.name}</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mono">{player.role}</div>
                                    <div className="flex gap-1 mt-1">
                                        {player.mostPlayed.slice(0, 2).map((agent, i) => (
                                            <span key={i} className="text-[8px] px-1.5 py-0.5 bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] font-black uppercase">
                                                {agent}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-[#00d4ff] mono">{player.kda}</div>
                                    <div className="text-[8px] text-gray-600 font-black uppercase mono">KDA</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Entity 2 Roster */}
                <div className="glass-panel p-6 bracket-container bg-black/20 border-[#ff00ff]/30">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-[#ff00ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <Users size={16} />
                            {team2.name}_ROSTER
                        </h3>
                        <Activity size={16} className="text-[#ff00ff] flicker" />
                    </div>
                    <div className="space-y-3">
                        {players2.map((player, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center p-3 bg-white/5 border border-white/5 hover:border-[#ff00ff]/30 transition-all"
                            >
                                <div>
                                    <div className="text-sm font-black text-white uppercase mono">{player.name}</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mono">{player.role}</div>
                                    <div className="flex gap-1 mt-1">
                                        {player.mostPlayed.slice(0, 2).map((agent, i) => (
                                            <span key={i} className="text-[8px] px-1.5 py-0.5 bg-[#ff00ff]/10 border border-[#ff00ff]/20 text-[#ff00ff] font-black uppercase">
                                                {agent}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-[#ff00ff] mono">{player.kda}</div>
                                    <div className="text-[8px] text-gray-600 font-black uppercase mono">KDA</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Role Matchups */}
            <div className="glass-panel p-6 bracket-container bg-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <Swords size={20} className="text-[#00ff88]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        ROLE_MATCHUPS
                    </h3>
                </div>

                <div className="space-y-3">
                    {roleMatchups.slice(0, 5).map((matchup: any, idx) => {
                        if (!matchup) return null;
                        const kda1 = matchup.player1 ? parseKDA(matchup.player1.kda) : 0;
                        const kda2 = matchup.player2 ? parseKDA(matchup.player2.kda) : 0;
                        const advantage = kda1 > kda2 ? 1 : kda2 > kda1 ? 2 : 0;

                        return (
                            <div key={idx} className="p-4 bg-black/40 border border-white/5">
                                <div className="text-[10px] font-black text-gray-500 uppercase mono mb-3 text-center">
                                    {matchup.role.toUpperCase()}_DUEL
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className={`flex-1 text-left ${advantage === 1 ? "" : "opacity-60"}`}>
                                        <div className="flex items-center gap-2">
                                            {advantage === 1 && <TrendingUp size={14} className="text-[#00ff88]" />}
                                            <span className="text-sm font-black text-[#00d4ff] mono">
                                                {matchup.player1?.name || "N/A"}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mono mt-1">
                                            KDA: {matchup.player1?.kda || "-"}
                                        </div>
                                    </div>

                                    <div className="px-4">
                                        <Crosshair size={20} className="text-gray-600" />
                                    </div>

                                    <div className={`flex-1 text-right ${advantage === 2 ? "" : "opacity-60"}`}>
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-sm font-black text-[#ff00ff] mono">
                                                {matchup.player2?.name || "N/A"}
                                            </span>
                                            {advantage === 2 && <TrendingUp size={14} className="text-[#00ff88]" />}
                                        </div>
                                        <div className="text-xs text-gray-500 mono mt-1">
                                            KDA: {matchup.player2?.kda || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Star Player Comparison */}
            <div className="glass-panel p-6 bracket-container bg-[#00ff88]/5 border-[#00ff88]/30">
                <div className="flex items-center gap-3 mb-6">
                    <Award size={20} className="text-[#00ff88]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        STAR_PLAYER_DUEL
                    </h3>
                </div>

                {(() => {
                    const star1 = players1.reduce((best, p) => parseKDA(p.kda) > parseKDA(best.kda) ? p : best, players1[0]);
                    const star2 = players2.reduce((best, p) => parseKDA(p.kda) > parseKDA(best.kda) ? p : best, players2[0]);
                    const star1KDA = parseKDA(star1?.kda || "1.0");
                    const star2KDA = parseKDA(star2?.kda || "1.0");
                    const starAdvantage = star1KDA > star2KDA ? 1 : 2;

                    return (
                        <div className="flex items-center justify-between p-6 bg-black/40 border border-white/10">
                            <div className={`text-center flex-1 ${starAdvantage === 1 ? "scale-105" : "opacity-70"}`}>
                                <div className="text-2xl font-black text-[#00d4ff] uppercase header-font">{star1?.name || "Unknown"}</div>
                                <div className="text-xs text-gray-500 mono uppercase mt-1">{star1?.role || "N/A"}</div>
                                <div className="text-4xl font-black text-white mt-3">{star1?.kda || "N/A"}</div>
                                <div className="text-[10px] text-gray-600 mono uppercase">KDA</div>
                                {starAdvantage === 1 && (
                                    <div className="mt-3 px-3 py-1 bg-[#00ff88] text-black text-[10px] font-black uppercase inline-block">
                                        EDGE
                                    </div>
                                )}
                            </div>

                            <div className="px-8">
                                <div className="w-16 h-16 bg-[#ff00ff]/20 border-2 border-[#ff00ff] flex items-center justify-center rotate-45">
                                    <Swords size={24} className="text-[#ff00ff] -rotate-45" />
                                </div>
                            </div>

                            <div className={`text-center flex-1 ${starAdvantage === 2 ? "scale-105" : "opacity-70"}`}>
                                <div className="text-2xl font-black text-[#ff00ff] uppercase header-font">{star2?.name || "Unknown"}</div>
                                <div className="text-xs text-gray-500 mono uppercase mt-1">{star2?.role || "N/A"}</div>
                                <div className="text-4xl font-black text-white mt-3">{star2?.kda || "N/A"}</div>
                                <div className="text-[10px] text-gray-600 mono uppercase">KDA</div>
                                {starAdvantage === 2 && (
                                    <div className="mt-3 px-3 py-1 bg-[#00ff88] text-black text-[10px] font-black uppercase inline-block">
                                        EDGE
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Agent Pool Diversity */}
            <div className="glass-panel p-6 bracket-container bg-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <Target size={20} className="text-[#00d4ff]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        AGENT_POOL_DIVERSITY
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 border-l-2 border-[#00d4ff]">
                        <div className="text-[10px] font-black text-[#00d4ff] uppercase mono mb-3">{team1.name}</div>
                        <div className="flex flex-wrap gap-1">
                            {Array.from(new Set(players1.flatMap(p => p.mostPlayed))).slice(0, 10).map((agent, i) => (
                                <span key={i} className="text-[9px] px-2 py-1 bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] font-black uppercase">
                                    {agent}
                                </span>
                            ))}
                        </div>
                        <div className="text-[10px] text-gray-600 mono mt-3">
                            {Array.from(new Set(players1.flatMap(p => p.mostPlayed))).length} unique agents
                        </div>
                    </div>

                    <div className="p-4 bg-black/40 border-l-2 border-[#ff00ff]">
                        <div className="text-[10px] font-black text-[#ff00ff] uppercase mono mb-3">{team2.name}</div>
                        <div className="flex flex-wrap gap-1">
                            {Array.from(new Set(players2.flatMap(p => p.mostPlayed))).slice(0, 10).map((agent, i) => (
                                <span key={i} className="text-[9px] px-2 py-1 bg-[#ff00ff]/10 border border-[#ff00ff]/20 text-[#ff00ff] font-black uppercase">
                                    {agent}
                                </span>
                            ))}
                        </div>
                        <div className="text-[10px] text-gray-600 mono mt-3">
                            {Array.from(new Set(players2.flatMap(p => p.mostPlayed))).length} unique agents
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VSMetricsView;
