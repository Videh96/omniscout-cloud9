import React from "react";
import { ComparisonReport } from "../comparisonService";
import { StrategyRadar } from "./Visualization";
import { exportComparisonToPDF } from "../exportReport";
import {
  Swords,
  Target,
  TrendingUp,
  Users,
  ShieldAlert,
  Activity,
  Zap,
  Award,
  ArrowRight,
  FileDown,
} from "lucide-react";

interface ComparisonViewProps {
  comparison: ComparisonReport;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ comparison }) => {
  const { team1, team2, headToHead } = comparison;

  const team1Radar = [
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

  const team2Radar = [
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

  const isTeam1Winner = headToHead.predictedWinner === team1.name;

  const handleExport = () => {
    exportComparisonToPDF(comparison);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Actions */}
      <div className="flex justify-end mb-4 no-print">
        <button
          onClick={handleExport}
          className="px-6 py-2.5 bg-white/5 border border-[#ff00ff]/30 hover:bg-[#ff00ff]/10 text-[#ff00ff] text-[10px] font-black uppercase tracking-[0.2em] mono flex items-center gap-3 transition-all active:scale-95 group bracket-container"
        >
          <FileDown
            size={14}
            className="group-hover:translate-y-0.5 transition-transform"
          />
          Download PDF Comparison
        </button>
      </div>

      {/* VS Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-8">
          <div className="text-right">
            <h2
              className={`text-3xl font-black italic uppercase header-font ${isTeam1Winner ? "text-[#00ff88] glow-text-cyan" : "text-white"}`}
            >
              {team1.name}
            </h2>
            <div className="text-xs text-gray-500 mono uppercase tracking-widest mt-1">
              {Math.round((team1.gridData?.teamStats.winRate || 0.5) * 100)}%
              Win Rate
            </div>
          </div>

          <div className="relative">
            <div className="w-20 h-20 bg-[#ff00ff]/20 border-2 border-[#ff00ff] flex items-center justify-center rotate-45">
              <Swords size={32} className="text-[#ff00ff] -rotate-45 flicker" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-[#ff00ff] mono tracking-widest">
              VS_MODE
            </div>
          </div>

          <div className="text-left">
            <h2
              className={`text-3xl font-black italic uppercase header-font ${!isTeam1Winner ? "text-[#00ff88] glow-text-cyan" : "text-white"}`}
            >
              {team2.name}
            </h2>
            <div className="text-xs text-gray-500 mono uppercase tracking-widest mt-1">
              {Math.round((team2.gridData?.teamStats.winRate || 0.5) * 100)}%
              Win Rate
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Banner */}
      <div className="glass-panel p-6 bracket-container bg-[#00ff88]/5 border-[#00ff88]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Award size={32} className="text-[#00ff88]" />
            <div>
              <div className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest mono">
                PREDICTED_WINNER
              </div>
              <div className="text-2xl font-black italic uppercase header-font text-white">
                {headToHead.predictedWinner}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black italic header-font text-[#00ff88]">
              {headToHead.confidence}%
            </div>
            <div className="text-[10px] text-gray-500 mono uppercase">
              Confidence
            </div>
          </div>
        </div>
      </div>

      {/* Side by Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team 1 Panel */}
        <div
          className={`glass-panel p-6 bracket-container ${isTeam1Winner ? "border-[#00ff88]/40" : "border-white/10"}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black italic uppercase header-font text-white">
              {team1.name}
            </h3>
            {isTeam1Winner && (
              <div className="px-3 py-1 bg-[#00ff88] text-black text-[10px] font-black uppercase">
                FAVORED
              </div>
            )}
          </div>

          <div className="h-48 mb-6">
            <StrategyRadar data={team1Radar} />
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest mono mb-2">
              Advantages
            </div>
            {headToHead.advantageAreas.team1.map((adv, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <TrendingUp size={14} className="text-[#00ff88]" />
                {adv}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-[10px] font-black text-[#ff00ff] uppercase tracking-widest mono mb-2">
              Key Weakness
            </div>
            <p className="text-sm text-gray-400 italic">
              {team1.report.tacticalInsights.weaknesses?.[0] ||
                "No critical weakness identified"}
            </p>
          </div>
        </div>

        {/* Team 2 Panel */}
        <div
          className={`glass-panel p-6 bracket-container ${!isTeam1Winner ? "border-[#00ff88]/40" : "border-white/10"}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black italic uppercase header-font text-white">
              {team2.name}
            </h3>
            {!isTeam1Winner && (
              <div className="px-3 py-1 bg-[#00ff88] text-black text-[10px] font-black uppercase">
                FAVORED
              </div>
            )}
          </div>

          <div className="h-48 mb-6">
            <StrategyRadar data={team2Radar} />
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest mono mb-2">
              Advantages
            </div>
            {headToHead.advantageAreas.team2.map((adv, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <TrendingUp size={14} className="text-[#00ff88]" />
                {adv}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-[10px] font-black text-[#ff00ff] uppercase tracking-widest mono mb-2">
              Key Weakness
            </div>
            <p className="text-sm text-gray-400 italic">
              {team2.report.tacticalInsights.weaknesses?.[0] ||
                "No critical weakness identified"}
            </p>
          </div>
        </div>
      </div>

      {/* Key Matchups */}
      <div className="glass-panel p-6 bracket-container bg-black/30">
        <div className="flex items-center gap-3 mb-6">
          <Target size={20} className="text-[#ff00ff]" />
          <h3 className="text-sm font-black tracking-widest uppercase header-font text-white">
            KEY_MATCHUPS
          </h3>
        </div>
        <div className="space-y-3">
          {headToHead.keyMatchups.map((matchup, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-black/40 border border-white/5"
            >
              <Zap size={16} className="text-[#00d4ff]" />
              <span className="text-sm text-gray-300 mono">{matchup}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div className="glass-panel p-8 bracket-container bg-[#00d4ff]/5 border-[#00d4ff]/30">
        <div className="flex items-start gap-4">
          <Activity size={24} className="text-[#00d4ff] shrink-0 mt-1" />
          <div>
            <div className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest mono mb-2">
              AI_VERDICT
            </div>
            <p className="text-lg font-bold text-white leading-relaxed">
              {headToHead.verdict}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 mono uppercase tracking-widest">
        <span className="text-[#ff00ff]">OMNISCOUT</span> VS_MODE // Powered by
        GRID + AI
      </div>
    </div>
  );
};

export default ComparisonView;
