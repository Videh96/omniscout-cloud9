import React from "react";
import { ScoutingReport, GridTeamData } from "../types";
import { exportToPDF } from "../exportReport";
import {
  ArrowUpRight,
  Target,
  ShieldAlert,
  History,
  ExternalLink,
  TrendingUp,
  Activity,
  AlertTriangle,
  Lightbulb,
  FileDown,
  Database,
} from "lucide-react";

interface ReportViewProps {
  report: ScoutingReport;
  gridData: GridTeamData | null;
}

const ReportView: React.FC<ReportViewProps> = ({ report, gridData }) => {
  const displayConfidence = report.tacticalInsights.confidenceScore || 0;

  const handleExport = () => {
    exportToPDF(report.teamName, report, {
      weaknesses: report.tacticalInsights.weaknesses || [],
      recommendations: [report.tacticalInsights.howToWin || ""],
      keyExploits: report.tacticalInsights.strengths || [],
      confidenceScore: displayConfidence,
    });
  };

  const gridBadge = "GRID Official";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 printable-area">
      {/* Section Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black italic tracking-widest uppercase glow-text-cyan header-font mb-2">
          SCOUT_DOSSIER
        </h1>
        <p className="text-sm text-gray-500 font-medium mono">
          Strategic overview for <span className="text-[#00d4ff]">{report.teamName}</span> • {report.game}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 no-print">
        <button
          onClick={handleExport}
          className="px-6 py-2.5 bg-white/5 border border-[#00d4ff]/30 hover:bg-[#00d4ff]/10 text-[#00d4ff] text-[10px] font-black uppercase tracking-[0.2em] mono flex items-center gap-3 transition-all active:scale-95 group bracket-container"
        >
          <FileDown
            size={14}
            className="group-hover:translate-y-0.5 transition-transform"
          />
          Download PDF Dossier
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="SERIES_COUNT"
          value={report.lastMatches.toString()}
          trend="GRID_Live_Stream"
          icon={<History size={16} />}
          badge={gridBadge}
        />
        <StatCard
          title="CONFIDENCE_SCORE"
          value={`${displayConfidence}%`}
          trend="Data_Certainty"
          primary={displayConfidence >= 80}
          icon={<TrendingUp size={16} />}
          badge="Formula_Valid"
        />
        <StatCard
          title="TEMPO_AGGRESSION"
          value={`${report.overallStrategy.earlyGameAggression}/100`}
          trend="Active_Pacing"
          icon={<Activity size={16} />}
          badge="AI Analysis"
        />
        <StatCard
          title="THREAT_LEVEL"
          value={report.tacticalInsights.threatLevel || "ELEVATED"}
          trend="Alert_Status"
          danger={report.tacticalInsights.threatLevel === "CRITICAL"}
          icon={<ShieldAlert size={16} />}
          badge="AI Analysis"
        />
      </div>

      {/* Counter-Strategy Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-black tracking-[0.4em] uppercase text-white mb-2 flex items-center gap-3 header-font">
          <ShieldAlert size={20} className="text-[#00d4ff]" />
          COUNTER-STRATEGY
          <span className="ml-auto text-[9px] text-[#ff00ff] mono bg-[#ff00ff]/10 px-2 py-0.5 border border-[#ff00ff]/30">
            AI_SYNTHESIZED
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-[#ff00ff]/10 border border-[#ff00ff]/30 shadow-lg relative overflow-hidden group bracket-container">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
              <ShieldAlert size={48} className="text-[#ff00ff]" />
            </div>
            <h4 className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.3em] mono mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="flicker" /> CRITICAL EXPLOIT
            </h4>
            <div className="space-y-3">
              {(report.tacticalInsights.weaknesses || []).length > 0 ? (
                report.tacticalInsights.weaknesses
                  .slice(0, 2)
                  .map((w, i) => (
                    <div
                      key={i}
                      className="text-lg font-black text-white italic uppercase tracking-tight header-font leading-tight"
                    >
                      {w}
                    </div>
                  ))
              ) : (
                <div className="text-lg font-black text-white italic uppercase tracking-tight header-font leading-tight">
                  NO_CRITICAL_WEAKNESS_IDENTIFIED
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-[#00d4ff]/10 border border-[#00d4ff]/30 shadow-lg relative overflow-hidden group bracket-container">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
              <Lightbulb size={48} className="text-[#00d4ff]" />
            </div>
            <h4 className="text-[10px] font-black text-[#00d4ff] uppercase tracking-[0.3em] mono mb-4 flex items-center gap-2">
              <Target size={14} /> C9 RECOMMENDATION
            </h4>
            <div className="space-y-3">
              {report.tacticalInsights.howToWin ? (
                <div className="text-[12px] font-bold text-gray-200 mono italic leading-relaxed">
                  {report.tacticalInsights.howToWin}
                </div>
              ) : (
                <div className="text-[12px] font-bold text-gray-200 mono italic leading-relaxed">
                  MAINTAIN_STANDARD_C9_DEFAULT
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="glass-panel p-6 bracket-container bg-black/20 border-[#00d4ff]/20">
        <div className="flex items-center gap-4">
          <Activity size={20} className="text-[#00d4ff]" />
          <div>
            <p className="text-[11px] font-black text-white uppercase mono">
              EXPLORE_MORE_DATA
            </p>
            <p className="text-[10px] text-gray-500 mono mt-1">
              Navigate to <span className="text-[#00d4ff]">TELEMETRY</span> for charts • <span className="text-[#ff00ff]">METRICS</span> for player stats • <span className="text-[#00ff88]">INTEL</span> for tactical insights
            </p>
          </div>
        </div>
      </div>

      {/* Sources Footer */}
      {report.sources && report.sources.length > 0 && (
        <div className="glass-panel p-8 mt-6 border-[#00d4ff]/30 bracket-container bg-black/40">
          <div className="flex items-center gap-3 mb-6 text-gray-500">
            <ExternalLink size={18} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mono header-font glow-text-cyan">
              INTEL_SOURCE_NODES
            </h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {report.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-black hover:bg-[#00d4ff]/15 border border-white/10 hover:border-[#00d4ff]/60 text-[10px] text-[#00d4ff] font-black flex items-center gap-4 transition-all mono laser-btn uppercase italic tracking-widest"
              >
                {source.title.slice(0, 32)}
                <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-12 pb-6 border-t border-white/5 mt-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-black border border-white/10 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Database size={20} className="text-[#00d4ff]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white mono">
              Source: GRID Esports API (C9 Partner)
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mono">
              STRATEGIC_INTEL_STREAM_ACTIVE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-500 uppercase mono">
              TERMINAL_REF
            </p>
            <p className="text-[10px] font-black text-[#00d4ff] mono uppercase tracking-widest">
              OS_CMD_2077_BETA
            </p>
          </div>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-500 uppercase mono">
              CLASSIFICATION
            </p>
            <p className="text-[10px] font-black text-[#ff00ff] mono uppercase tracking-widest">
              CONFIDENTIAL_C9
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  trend: string;
  primary?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
  badge?: string;
}> = ({ title, value, trend, primary, danger, icon, badge }) => (
  <div
    className={`p-8 transition-all border relative group overflow-hidden bracket-container ${primary
      ? "bg-[#00d4ff]/10 border-[#00d4ff]/50 glow-cyan"
      : danger
        ? "bg-[#ff00ff]/10 border-[#ff00ff]/40 glow-magenta"
        : "glass-panel border-white/5 hover:border-[#00d4ff]/20"
      }`}
  >
    {badge && (
      <div
        className={`absolute top-2 right-2 px-1.5 py-0.5 text-[7px] font-black uppercase mono border ${badge.includes("GRID")
          ? "text-[#00d4ff] border-[#00d4ff]/30 bg-[#00d4ff]/5"
          : badge.includes("DEMO")
            ? "text-amber-500 border-amber-500/30 bg-amber-500/5"
            : badge.includes("Valid")
              ? "text-[#00ff88] border-[#00ff88]/30 bg-[#00ff88]/5"
              : "text-[#ff00ff] border-[#ff00ff]/30 bg-[#ff00ff]/5"
          }`}
      >
        {badge}
      </div>
    )}
    <div
      className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center justify-between mono header-font ${primary ? "text-[#00d4ff]" : "text-gray-500"}`}
    >
      {title}
      <div className={primary || danger ? "flicker" : ""}>{icon}</div>
    </div>
    <div className="flex items-end justify-between">
      <div
        className={`text-2xl sm:text-4xl font-black italic uppercase tracking-tighter header-font ${primary
          ? "text-white glow-text-cyan"
          : danger
            ? "text-[#ff00ff] flicker"
            : "text-white"
          }`}
      >
        {value}
      </div>
      <div
        className={`w-10 h-10 flex items-center justify-center transition-transform group-hover:rotate-45 ${primary ? "text-[#00d4ff]" : "text-gray-700"}`}
      >
        <ArrowUpRight size={22} />
      </div>
    </div>
    <div
      className={`mt-5 text-[9px] font-black uppercase tracking-[0.3em] mono ${primary ? "text-[#00d4ff]/70" : "text-[#00ff88]"}`}
    >
      // {trend}
    </div>
  </div>
);

export default ReportView;
