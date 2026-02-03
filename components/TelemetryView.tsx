import React, { useMemo } from "react";
import { ScoutingReport, GridTeamData } from "../types";
import { RoundedBarChart, StrategyRadar } from "./Visualization";
import {
    Wallet,
    Cpu,
    Map as MapIcon,
} from "lucide-react";

interface TelemetryViewProps {
    report: ScoutingReport;
    gridData: GridTeamData | null;
}

const TelemetryView: React.FC<TelemetryViewProps> = ({ report, gridData }) => {
    // Generate a simple hash from the team name for consistent but varied values
    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };

    const playerHash = hashCode(report.teamName);
    const isLoL = report.game === "League of Legends";

    // Dynamic radar data with nano-variance
    const radarData = useMemo(() => {
        const nv = (seed: number, min: number, max: number) => {
            const x = Math.sin(playerHash * seed) * 10000;
            return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
        };

        return [
            {
                subject: "AGGRESSION",
                A: report.overallStrategy.earlyGameAggression,
                fullMark: 100,
            },
            {
                subject: "OBJECTIVE",
                A: report.overallStrategy.objectivePriority === "High"
                    ? nv(1, 85, 98)
                    : report.overallStrategy.objectivePriority === "Medium"
                        ? nv(2, 55, 75)
                        : nv(3, 35, 50),
                fullMark: 100,
            },
            { subject: "MACRO", A: nv(4, 45, 92), fullMark: 100 },
            { subject: "VISION", A: nv(5, 38, 88), fullMark: 100 },
            {
                subject: isLoL ? "DRAFT" : "COMP",
                A: nv(6, 42, 95),
                fullMark: 100,
            },
        ];
    }, [report, playerHash, isLoL]);

    // Dynamic economic data with nano-variance
    const economicData = useMemo(() => {
        const nv = (seed: number, min: number, max: number) => {
            const x = Math.sin(playerHash * seed * 1.5) * 10000;
            return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
        };

        if (isLoL) {
            return [
                { name: "Early Game", val: nv(11, 40, 85), active: true },
                { name: "Dragon Control", val: nv(12, 30, 90) },
                { name: "Baron Setup", val: nv(13, 35, 88), active: true },
                { name: "Team Fight", val: nv(14, 50, 95) },
                { name: "Late Game", val: nv(15, 45, 92), active: true },
            ];
        } else {
            return [
                { name: "Pistols", val: nv(21, 42, 68), active: true },
                { name: "Eco Rounds", val: nv(22, 18, 45) },
                { name: "Force Buy", val: nv(23, 35, 75), active: true },
                { name: "Half Buy", val: nv(24, 40, 65) },
                { name: "Full Buy", val: nv(25, 45, 85), active: true },
            ];
        }
    }, [gridData, playerHash, isLoL]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black italic tracking-widest uppercase glow-text-cyan header-font mb-2">
                    TELEMETRY_STREAM
                </h1>
                <p className="text-sm text-gray-500 font-medium mono">
                    Real-time data visualization for <span className="text-[#00d4ff]">{report.teamName}</span>
                </p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 bracket-container bg-black/20">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest mono header-font flex items-center gap-2">
                            <Wallet size={14} />
                            {isLoL ? "Game_Phase_Analysis" : "Economic_Patterns"}
                        </h3>
                        <span
                            className="text-[8px] font-black uppercase mono bg-black/50 px-1.5 border text-[#00d4ff] border-[#00d4ff]/20"
                        >
                            GRID_LIVE
                        </span>
                    </div>
                    <RoundedBarChart data={economicData} />
                </div>

                <div className="glass-panel p-6 bracket-container relative overflow-hidden bg-black/20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-[#ff00ff] uppercase tracking-widest mono header-font">
                            Tactical_Signature
                        </h3>
                        <Cpu size={18} className="text-[#ff00ff] opacity-40 tech-spin" />
                    </div>
                    <StrategyRadar data={radarData} />
                </div>
            </div>

            {/* Map Veto Advisory */}
            <div className="glass-panel p-8 bracket-container bg-black/30">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black tracking-[0.3em] uppercase flex items-center gap-3 header-font glow-text-cyan">
                        <MapIcon size={20} className="text-[#00d4ff]" />
                        MAP_VETO_ADVISORY
                        <span className="text-[9px] text-[#00ff88] mono bg-[#00ff88]/10 px-2 py-0.5 border border-[#00ff88]/30">
                            TELEMETRY_DRIVEN
                        </span>
                    </h3>
                    <div className="hidden sm:block px-3 py-1 bg-black border border-[#00ff88]/20 text-[8px] font-black text-[#00ff88] tracking-[0.3em] uppercase mono flicker">
                        VETO_LOGIC_ACTIVE
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {gridData?.teamStats.mapStats &&
                        Object.entries(gridData.teamStats.mapStats).map(
                            ([mapName, stats], idx) => {
                                const isHigh = stats.winRate > 0.7;
                                const isLow = stats.winRate < 0.5;
                                return (
                                    <div
                                        key={idx}
                                        className={`p-5 border flex flex-col items-center text-center transition-all ${isHigh
                                            ? "bg-[#ff00ff]/5 border-[#ff00ff]/20"
                                            : isLow
                                                ? "bg-[#00ff88]/5 border-[#00ff88]/20"
                                                : "bg-black/40 border-white/5"
                                            }`}
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-widest mono text-gray-500 mb-1">
                                            {mapName}
                                        </div>
                                        <div
                                            className={`text-2xl font-black header-font italic ${isHigh ? "text-[#ff00ff]" : isLow ? "text-[#00ff88]" : "text-white"}`}
                                        >
                                            {Math.round(stats.winRate * 100)}%
                                        </div>
                                        <div
                                            className={`mt-3 px-3 py-1 text-[9px] font-black uppercase tracking-tighter ${isHigh
                                                ? "bg-[#ff00ff] text-black"
                                                : isLow
                                                    ? "bg-[#00ff88] text-black"
                                                    : "bg-white/10 text-gray-400"
                                                }`}
                                        >
                                            {isHigh
                                                ? "PRIORITY_BAN"
                                                : isLow
                                                    ? "TARGET_PICK"
                                                    : "NEUTRAL_POS"}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                </div>
            </div>
        </div>
    );
};

export default TelemetryView;
