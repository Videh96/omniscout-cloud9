import React from "react";
import { ComparisonReport } from "../comparisonService";
import { StrategyRadar } from "./Visualization";
import {
    Network,
    TrendingUp,
    Target,
    Zap,
    BarChart3,
    Map,
    Clock,
    DollarSign,
} from "lucide-react";

interface VSTelemetryViewProps {
    comparison: ComparisonReport;
}

const VSTelemetryView: React.FC<VSTelemetryViewProps> = ({ comparison }) => {
    const { team1, team2 } = comparison;

    // Build radar data for both entities
    const entity1Radar = [
        {
            subject: "AGG",
            A: team1.report.overallStrategy.earlyGameAggression,
            fullMark: 100,
        },
        {
            subject: "OBJ",
            A: team1.report.overallStrategy.objectivePriority === "High" ? 90 : 60,
            fullMark: 100,
        },
        {
            subject: "CONF",
            A: team1.report.tacticalInsights.confidenceScore,
            fullMark: 100,
        },
        {
            subject: "WR",
            A: (team1.gridData?.teamStats.winRate || 0.5) * 100,
            fullMark: 100,
        },
    ];

    const entity2Radar = [
        {
            subject: "AGG",
            A: team2.report.overallStrategy.earlyGameAggression,
            fullMark: 100,
        },
        {
            subject: "OBJ",
            A: team2.report.overallStrategy.objectivePriority === "High" ? 90 : 60,
            fullMark: 100,
        },
        {
            subject: "CONF",
            A: team2.report.tacticalInsights.confidenceScore,
            fullMark: 100,
        },
        {
            subject: "WR",
            A: (team2.gridData?.teamStats.winRate || 0.5) * 100,
            fullMark: 100,
        },
    ];

    // Economy stats
    const eco1 = team1.gridData?.teamStats;
    const eco2 = team2.gridData?.teamStats;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-widest uppercase glow-text-magenta header-font mb-2">
                    VS_TELEMETRY
                </h1>
                <p className="text-sm text-gray-500 font-medium mono">
                    Comparative telemetry data: <span className="text-[#00d4ff]">{team1.name}</span> vs <span className="text-[#ff00ff]">{team2.name}</span>
                </p>
            </div>

            {/* Side-by-Side Radar Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 bracket-container bg-black/20 border-[#00d4ff]/30">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-[#00d4ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <Network size={16} />
                            {team1.name}_SIGNATURE
                        </h3>
                    </div>
                    <div className="h-56">
                        <StrategyRadar data={entity1Radar} />
                    </div>
                </div>

                <div className="glass-panel p-6 bracket-container bg-black/20 border-[#ff00ff]/30">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-[#ff00ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <Network size={16} />
                            {team2.name}_SIGNATURE
                        </h3>
                    </div>
                    <div className="h-56">
                        <StrategyRadar data={entity2Radar} />
                    </div>
                </div>
            </div>

            {/* Economy Comparison */}
            <div className="glass-panel p-6 bracket-container bg-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <DollarSign size={20} className="text-[#00ff88]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        ECONOMY_ANALYSIS
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Pistol Win Rate */}
                    <div className="p-4 bg-black/40 border border-white/5">
                        <div className="text-[10px] font-black text-gray-500 uppercase mono mb-3">PISTOL_ROUND_WR</div>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#00d4ff]">{Math.round((eco1?.pistolWinRate || 0.5) * 100)}%</div>
                                <div className="text-[9px] text-gray-600 mono">{team1.name}</div>
                            </div>
                            <Zap size={20} className="text-gray-600" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#ff00ff]">{Math.round((eco2?.pistolWinRate || 0.5) * 100)}%</div>
                                <div className="text-[9px] text-gray-600 mono">{team2.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Eco Round Win Rate */}
                    <div className="p-4 bg-black/40 border border-white/5">
                        <div className="text-[10px] font-black text-gray-500 uppercase mono mb-3">ECO_ROUND_WR</div>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#00d4ff]">{Math.round((eco1?.ecoWinRate || 0.15) * 100)}%</div>
                                <div className="text-[9px] text-gray-600 mono">{team1.name}</div>
                            </div>
                            <BarChart3 size={20} className="text-gray-600" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#ff00ff]">{Math.round((eco2?.ecoWinRate || 0.15) * 100)}%</div>
                                <div className="text-[9px] text-gray-600 mono">{team2.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Round Duration */}
                    <div className="p-4 bg-black/40 border border-white/5">
                        <div className="text-[10px] font-black text-gray-500 uppercase mono mb-3">AVG_ROUND_DURATION</div>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#00d4ff]">{eco1?.avgRoundDuration || "1:30"}</div>
                                <div className="text-[9px] text-gray-600 mono">{team1.name}</div>
                            </div>
                            <Clock size={20} className="text-gray-600" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#ff00ff]">{eco2?.avgRoundDuration || "1:30"}</div>
                                <div className="text-[9px] text-gray-600 mono">{team2.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Overall Win Rate */}
                    <div className="p-4 bg-black/40 border border-white/5">
                        <div className="text-[10px] font-black text-gray-500 uppercase mono mb-3">OVERALL_WIN_RATE</div>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#00d4ff]">{Math.round((eco1?.winRate || 0.5) * 100)}%</div>
                                <div className="text-[9px] text-gray-600 mono">{team1.name}</div>
                            </div>
                            <TrendingUp size={20} className="text-gray-600" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#ff00ff]">{Math.round((eco2?.winRate || 0.5) * 100)}%</div>
                                <div className="text-[9px] text-gray-600 mono">{team2.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Pool Comparison */}
            <div className="glass-panel p-6 bracket-container bg-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <Map size={20} className="text-[#00d4ff]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        MAP_POOL_OVERLAP
                    </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Entity 1 Maps */}
                    <div className="p-4 bg-black/40 border-l-2 border-[#00d4ff]">
                        <div className="text-[10px] font-black text-[#00d4ff] uppercase mono mb-3">{team1.name} MAPS</div>
                        <div className="space-y-2">
                            {Object.entries(eco1?.mapStats || { "Haven": { winRate: 0.6 }, "Bind": { winRate: 0.55 } }).map(([map, stats]) => (
                                <div key={map} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300 mono uppercase">{map}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-white/10 overflow-hidden">
                                            <div
                                                className="h-full bg-[#00d4ff]"
                                                style={{ width: `${(stats as any).winRate * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-[#00d4ff] mono">{Math.round((stats as any).winRate * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Entity 2 Maps */}
                    <div className="p-4 bg-black/40 border-l-2 border-[#ff00ff]">
                        <div className="text-[10px] font-black text-[#ff00ff] uppercase mono mb-3">{team2.name} MAPS</div>
                        <div className="space-y-2">
                            {Object.entries(eco2?.mapStats || { "Ascent": { winRate: 0.65 }, "Split": { winRate: 0.5 } }).map(([map, stats]) => (
                                <div key={map} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300 mono uppercase">{map}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-white/10 overflow-hidden">
                                            <div
                                                className="h-full bg-[#ff00ff]"
                                                style={{ width: `${(stats as any).winRate * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-[#ff00ff] mono">{Math.round((stats as any).winRate * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tempo Analysis */}
            <div className="glass-panel p-6 bracket-container bg-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <Target size={20} className="text-[#00ff88]" />
                    <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
                        TEMPO_ANALYSIS
                    </h3>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5">
                    <div className="text-center flex-1">
                        <div className="text-3xl font-black text-[#00d4ff]">{team1.report.overallStrategy.earlyGameAggression}</div>
                        <div className="text-[9px] text-gray-500 mono uppercase mt-1">Aggression Index</div>
                        <div className="text-xs text-gray-400 mono mt-2">{team1.name}</div>
                    </div>

                    <div className="flex-1 px-8">
                        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00d4ff] to-transparent"
                                style={{ width: `${team1.report.overallStrategy.earlyGameAggression}%` }}
                            />
                            <div
                                className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#ff00ff] to-transparent"
                                style={{ width: `${team2.report.overallStrategy.earlyGameAggression}%` }}
                            />
                        </div>
                        <div className="text-center text-[9px] text-gray-600 mono uppercase mt-2">
                            {team1.report.overallStrategy.earlyGameAggression > team2.report.overallStrategy.earlyGameAggression
                                ? `${team1.name} MORE AGGRESSIVE`
                                : team1.report.overallStrategy.earlyGameAggression < team2.report.overallStrategy.earlyGameAggression
                                    ? `${team2.name} MORE AGGRESSIVE`
                                    : "EQUAL TEMPO"}
                        </div>
                    </div>

                    <div className="text-center flex-1">
                        <div className="text-3xl font-black text-[#ff00ff]">{team2.report.overallStrategy.earlyGameAggression}</div>
                        <div className="text-[9px] text-gray-500 mono uppercase mt-1">Aggression Index</div>
                        <div className="text-xs text-gray-400 mono mt-2">{team2.name}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VSTelemetryView;
