import React, { useState, useEffect } from "react";
import { AppState, GameType, GridTeamData } from "./types";
import { generateScoutingReport } from "./groqService";
import { fetchTeamData } from "./gridService";
import { generateComparison, ComparisonReport } from "./comparisonService";
import { getCurrentPatch } from "./patchService";
import Sidebar, { TacticalLogo } from "./components/Sidebar";
import ReportView from "./components/ReportView";
import ComparisonView from "./components/ComparisonView";
import TelemetryView from "./components/TelemetryView";
import MetricsView from "./components/MetricsView";
import IntelView from "./components/IntelView";
import VSTelemetryView from "./components/VSTelemetryView";
import VSMetricsView from "./components/VSMetricsView";
import VSIntelView from "./components/VSIntelView";
import {
  Search,
  Loader2,
  Info,
  Bell,
  User,
  LayoutGrid,
  Cpu,
  Network,
  Terminal,
  Database,
  ShieldAlert,
  AlertCircle,
  Lock,
  Activity,
  HardDrive,
  Swords,
  Sparkles,
} from "lucide-react";

const TacticalTerminal: React.FC<{
  teamName: string;
  game: string;
  status: string;
}> = ({ teamName, game, status }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    setVisibleLines(0);
    const timer = setInterval(() => {
      setVisibleLines((prev) => (prev < 5 ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(timer);
  }, [status]);

  const logs = [
    { text: `> HANDSHAKE_SUCCESSFUL (GRID_v4.2.0)`, color: "text-[#00ff88]" },
    { text: `> TARGET_ID: ${teamName.toUpperCase()}`, color: "text-[#00d4ff]" },
    { text: `> STATUS: ${status.toUpperCase()}`, color: "text-amber-500" },
    { text: `> DECRYPTING_PLAYER_HABITS_LAYER_7...`, color: "text-[#ff00ff]" },
    {
      text: `> COMPILING_TACTICAL_RECOMMENDATIONS...`,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="mt-12 w-full bg-[#0a0a0f]/80 backdrop-blur-xl p-8 rounded-none border border-white/5 max-w-2xl bracket-container shadow-2xl transition-all hover:border-white/10 group">
      <div className="text-[11px] mono space-y-2.5">
        {logs.slice(0, visibleLines).map((log, i) => (
          <p
            key={i}
            className={`${log.color} reveal-line font-bold flex items-center gap-1`}
          >
            {log.text}
            {i === visibleLines - 1 && (
              <span className="terminal-cursor"></span>
            )}
          </p>
        ))}
        {visibleLines === 0 && (
          <p className="text-gray-600 terminal-cursor">Processing Node...</p>
        )}
      </div>
    </div>
  );
};

// Placeholder View Component
const PlaceholderView: React.FC<{
  title: string;
  icon: React.ReactNode;
  message: string;
}> = ({ title, icon, message }) => (
  <div className="h-[70vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto relative animate-in zoom-in-95 fade-in duration-500">
    <div className="w-32 h-32 flex items-center justify-center mb-8 bg-black/40 border border-white/10 rounded-full group hover:border-[#00d4ff]/50 transition-all">
      <div className="text-gray-600 group-hover:text-[#00d4ff] transition-colors scale-150">
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-black mb-3 uppercase tracking-[0.3em] italic text-white header-font">
      {title}
    </h3>
    <p className="text-xs font-bold text-gray-500 mono uppercase tracking-widest max-w-xs leading-relaxed">
      {message}
    </p>
    <div className="mt-8 px-4 py-2 bg-[#ff00ff]/10 border border-[#ff00ff]/30 text-[#ff00ff] text-[10px] font-black uppercase tracking-[0.2em] mono">
      INITIATE_SEARCH // HACKATHON_BUILD
    </div>
  </div>
);

const App: React.FC = () => {
  const [teamName, setTeamName] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [vsMode, setVsMode] = useState(false);
  const [game, setGame] = useState<GameType>("VALORANT");
  const [matches, setMatches] = useState(10);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [currentView, setCurrentView] = useState("SCOUT"); // Default to SCOUT for immediate utility
  const [systemMessage, setSystemMessage] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonReport | null>(null);

  const currentPatch = getCurrentPatch(game);

  const [state, setState] = useState<AppState>({
    isGenerating: false,
    report: null,
    gridData: null,
    error: null,
  });

  const handleGenerate = async (overrideName?: string | React.MouseEvent) => {
    // If called via event handler (click), ignore the event object
    // If called directly with a string, use that as the search term
    const searchTerm = typeof overrideName === 'string' ? overrideName : teamName;

    if (!searchTerm) return;
    if (vsMode && !team2Name) return;

    // Update input field if we're searching for something new
    if (typeof overrideName === 'string') {
      setTeamName(overrideName);
    }

    setState({
      ...state,
      isGenerating: true,
      error: null,
      report: null,
      gridData: null,
    });
    setComparisonResult(null);
    setLoadingProgress(0);


    try {
      if (vsMode) {
        // VS Mode: Generate comparison between two teams
        setLoadingStatus("Fetching team 1 data...");
        setLoadingProgress(20);

        setLoadingStatus("Fetching team 2 data...");
        setLoadingProgress(40);

        setLoadingStatus("Generating head-to-head analysis...");
        setLoadingProgress(70);

        const comparison = await generateComparison(
          searchTerm,
          team2Name,
          game,
          matches,
        );

        setLoadingProgress(100);

        setTimeout(() => {
          setState({
            isGenerating: false,
            report: null,
            gridData: null,
            error: null,
          });
          setComparisonResult(comparison);
        }, 500);
      } else {
        // Standard Mode: Single team analysis
        let gridData: GridTeamData | null = null;
        setLoadingStatus("Fetching GRID telemetry...");
        setLoadingProgress(20);

        // NO FALLBACKS allowed - must be real GRID data or fail
        gridData = await fetchTeamData(searchTerm, game);


        setLoadingStatus("Analyzing patterns...");
        setLoadingProgress(50);
        await new Promise((r) => setTimeout(r, 800));

        setLoadingStatus("Generating counter-strategies...");
        setLoadingProgress(80);
        const report = await generateScoutingReport(
          searchTerm,
          game,
          matches,
          gridData,
        );

        setLoadingProgress(100);

        setTimeout(() => {
          setState({
            isGenerating: false,
            report,
            gridData,
            error: null,
          });
        }, 500);
      }
    } catch (err: any) {
      console.error(err);

      let errorMessage = "STRATEGIC_DECRYPTION_FAILED: 0xCC2";

      if (err?.message?.includes("401") || err?.message?.includes("Invalid")) {
        errorMessage = "AUTH_ERROR: Invalid API key credentials.";
      } else if (err?.message) {
        errorMessage = `SYSTEM_ERROR: ${err.message}`;
      }

      setState({
        isGenerating: false,
        report: null,
        gridData: null,
        error: errorMessage,
      });
    }
  };

  const handleSystemAction = (action: string) => {
    setSystemMessage(`${action}_SEQUENCE_INITIATED...`);
    setTimeout(() => setSystemMessage(null), 3000);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-gray-100 selection:bg-[#00d4ff]/30 overflow-hidden relative">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentView={currentView}
        onNavigate={setCurrentView}
        onSystemAction={handleSystemAction}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* System Overlay Message */}
        {systemMessage && (
          <div className="absolute top-24 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] px-6 py-4 bracket-container backdrop-blur-md shadow-[0_0_20px_rgba(0,212,255,0.2)]">
              <div className="flex items-center gap-3">
                <Activity className="tech-spin" size={18} />
                <span className="text-xs font-black uppercase tracking-widest mono">
                  {systemMessage}
                </span>
              </div>
            </div>
          </div>
        )}

        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 glass-panel sticky top-0 z-50">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            {currentView === "SCOUT" && (
              <>
                <div className="flex-1 relative bracket-container animate-in fade-in slide-in-from-left-4 border border-white/10 hover:border-[#00d4ff] transition-all cursor-text backdrop-blur-md group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00d4ff] group-hover:text-[#00d4ff] transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="ID_TARGET_ENTITY..."
                    className="w-full bg-black/50 border-none rounded-none py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-0 transition-all font-medium placeholder-gray-700 mono text-white placeholder:text-gray-600"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                </div>
                <button
                  onClick={() => handleGenerate()}
                  disabled={
                    state.isGenerating || !teamName || (vsMode && !team2Name)
                  }
                  className={`px-6 py-3 rounded-none text-xs font-black italic uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50 laser-btn header-font whitespace-nowrap ${vsMode ? "bg-[#ff00ff] text-black glow-magenta hover:bg-white" : "bg-[#00d4ff] text-black glow-cyan hover:bg-[#00ff88] hover:shadow-[#00ff88]/50"}`}
                >
                  {state.isGenerating ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : vsMode ? (
                    <Swords size={16} />
                  ) : (
                    <LayoutGrid size={16} />
                  )}
                  {state.isGenerating
                    ? "PARSING..."
                    : vsMode
                      ? "COMPARE_TEAMS"
                      : "DECOMPRESS_DOSSIER"}
                </button>
              </>
            )}
            {currentView !== "SCOUT" && (
              <div className="text-xl font-black italic tracking-widest uppercase text-white/20 header-font">
                {currentView}_MODULE
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 ml-8">
            <button
              className="text-gray-400 hover:text-[#ff00ff] transition-all relative p-2 rounded-none hover:bg-[#ff00ff]/10 active:scale-90"
              onClick={() => handleSystemAction("NOTIFICATION_PURGE")}
              title="Clear notifications"
              aria-label="Clear notifications"
            >
              <Bell size={20} className="flicker" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-black text-white uppercase tracking-widest header-font">
                  Op_Root
                </div>
                <div className="text-[10px] text-[#00d4ff] font-bold uppercase mono glow-text-cyan">
                  LINK_SECURE
                </div>
              </div>
              <div
                className="w-11 h-11 bg-black border border-[#00d4ff]/30 flex items-center justify-center overflow-hidden shadow-lg group cursor-pointer hover:border-[#00d4ff] transition-all hover:scale-105 active:scale-95"
                onClick={() => handleSystemAction("USER_AUTH_REFRESH")}
              >
                <User
                  className="text-gray-500 group-hover:text-[#00d4ff] transition-colors"
                  size={24}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {/* VIEW CONTROLLER */}
          {currentView === "HOME" && (
            <div className="h-full flex flex-col items-center justify-center relative animate-in zoom-in-95 fade-in duration-700">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
              <div className="w-64 h-64 mb-10 relative group">
                <div className="absolute inset-0 bg-[#00d4ff]/20 blur-[100px] rounded-full group-hover:bg-[#00d4ff]/30 transition-all duration-1000"></div>
                <TacticalLogo className="w-full h-full drop-shadow-[0_0_50px_rgba(0,212,255,0.6)] relative z-10" />
              </div>
              <h1 className="text-6xl font-black italic tracking-widest uppercase mb-4 glow-text-cyan header-font text-center">
                OMNI_SCOUT
              </h1>
              <p className="text-sm text-gray-400 font-medium mono tracking-[0.3em] uppercase mb-12">
                Advanced Esport Telemetry & Strategic AI
              </p>
              <button
                onClick={() => setCurrentView("SCOUT")}
                className="px-10 py-4 bg-[#00d4ff] text-black text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_50px_rgba(0,212,255,0.6)] hover:bg-white transition-all active:scale-95 header-font clip-corner"
              >
                Initialize_Core
              </button>
            </div>
          )}

          {currentView === "SCOUT" && (
            <>
              <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black italic tracking-widest uppercase glow-text-cyan header-font">
                      {vsMode ? "VS_Mode" : "Strategic_Terminal"}
                    </h1>
                    {vsMode && (
                      <Swords className="text-[#ff00ff] flicker" size={28} />
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500 font-medium mono">
                      Autonomous{" "}
                      <span className="text-[#00d4ff] animate-pulse">GRID</span>{" "}
                      Ingestion Engine // 2077_BETA
                    </p>
                    <div className="px-2 py-1 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-[8px] font-black uppercase mono">
                      PATCH {currentPatch.version}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* VS Mode Toggle */}
                  <button
                    onClick={() => {
                      setVsMode(!vsMode);
                      setComparisonResult(null);
                      setState({ ...state, report: null });
                    }}
                    className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase transition-all tracking-widest header-font flex items-center gap-2 ${vsMode ? "bg-[#ff00ff] text-black glow-magenta" : "bg-black/50 border border-white/10 text-gray-500 hover:text-white hover:border-[#ff00ff]/50"}`}
                    title="Toggle VS Mode for head-to-head team comparison"
                  >
                    <Swords size={14} />
                    VS_MODE
                  </button>

                  {/* Match Sample Selector */}
                  <div className="flex bg-black/50 p-1 rounded-none border border-white/5 backdrop-blur-md">
                    {[3, 5, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setMatches(n)}
                        className={`px-3 py-2 rounded-none text-[10px] font-black uppercase transition-all tracking-widest mono ${matches === n ? "bg-[#00ff88] text-black" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                        title={`Analyze ${n} matches`}
                      >
                        {n}M
                      </button>
                    ))}
                  </div>

                  <div className="flex bg-black/50 p-1 rounded-none border border-white/5 backdrop-blur-md">
                    <button
                      onClick={() => setGame("VALORANT")}
                      className={`px-5 py-2.5 rounded-none text-[10px] font-black uppercase transition-all tracking-widest header-font ${game === "VALORANT" ? "bg-[#00d4ff] text-black glow-cyan" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                    >
                      VAL_NET
                    </button>
                    <button
                      onClick={() => setGame("League of Legends")}
                      className={`px-5 py-2.5 rounded-none text-[10px] font-black uppercase transition-all tracking-widest header-font ${game === "League of Legends" ? "bg-[#00d4ff] text-black glow-cyan" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                    >
                      LOL_CORE
                    </button>
                  </div>
                </div>
              </div>

              {/* VS Mode Team Inputs */}
              {vsMode && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="relative bracket-container border border-[#00d4ff]/30 hover:border-[#00d4ff] transition-all backdrop-blur-md group">
                    <div className="absolute top-2 left-4 text-[8px] font-black text-[#00d4ff] uppercase tracking-widest mono">
                      TEAM_1
                    </div>
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00d4ff] transition-colors"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="First team name..."
                      className="w-full bg-black/50 border-none rounded-none py-4 pt-6 pl-11 pr-4 text-sm focus:outline-none focus:ring-0 font-medium placeholder-gray-700 mono text-white"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="relative bracket-container border border-[#ff00ff]/30 hover:border-[#ff00ff] transition-all backdrop-blur-md group">
                    <div className="absolute top-2 left-4 text-[8px] font-black text-[#ff00ff] uppercase tracking-widest mono">
                      TEAM_2
                    </div>
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ff00ff] transition-colors"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Second team name..."
                      className="w-full bg-black/50 border-none rounded-none py-4 pt-6 pl-11 pr-4 text-sm focus:outline-none focus:ring-0 font-medium placeholder-gray-700 mono text-white"
                      value={team2Name}
                      onChange={(e) => setTeam2Name(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                  </div>
                </div>
              )}



              {!state.report &&
                !comparisonResult &&
                !state.isGenerating &&
                !state.error && (
                  <div className="h-[50vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto relative animate-in zoom-in-95 fade-in duration-700 opacity-50">
                    <div className="w-32 h-32 flex items-center justify-center mb-6 group cursor-pointer relative grayscale hover:grayscale-0 transition-all duration-500">
                      <TacticalLogo className="w-24 h-24" />
                    </div>
                    <h3 className="text-xl font-black mb-3 uppercase tracking-[0.3em] italic text-gray-600 header-font">
                      {vsMode ? "ENTER_TWO_TEAMS" : "AWAITING_TARGET"}
                    </h3>
                  </div>
                )}

              {state.error && (
                <div
                  className={`p-5 rounded-none flex items-start gap-4 mb-8 max-w-2xl mx-auto shadow-xl bracket-container ${state.error.includes("AUTH_ERROR") ? "bg-amber-500/10 border border-amber-500/30 text-amber-500 glow-amber" : "bg-[#ff00ff]/5 border border-[#ff00ff]/20 text-[#ff00ff] glow-magenta"}`}
                >
                  {state.error.includes("AUTH_ERROR") ? (
                    <AlertCircle size={24} className="flicker shrink-0 mt-1" />
                  ) : (
                    <Info size={24} className="flicker shrink-0 mt-1" />
                  )}
                  <div>
                    <p className="text-xs font-black uppercase mono mb-1 tracking-widest header-font">
                      {state.error.includes("AUTH_ERROR")
                        ? "ACCESS_DENIED"
                        : "SYSTEM_CRITICAL_FAILURE"}
                    </p>
                    <p className="text-sm font-bold text-gray-300 mono leading-relaxed">
                      {state.error}
                    </p>
                    {state.error.includes("AUTH_ERROR") && (
                      <div className="mt-3 pt-3 border-t border-amber-500/20">
                        <p className="text-[10px] font-black uppercase text-amber-500/70 mono">
                          Resolution Advice:
                        </p>
                        <p className="text-[11px] text-gray-400 mono mt-1">
                          Check your VITE_GROQ_API_KEY in .env.local. Get a key
                          at{" "}
                          <a
                            href="https://console.groq.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-amber-400"
                          >
                            console.groq.com
                          </a>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {state.isGenerating && (
                <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="relative mb-12">
                    <div
                      className={`w-40 h-40 border-[1px] ${vsMode ? "border-[#ff00ff]/20" : "border-[#00d4ff]/20"} flex items-center justify-center rotate-45 group`}
                    >
                      <div
                        className={`absolute inset-0 border-2 ${vsMode ? "border-[#ff00ff]" : "border-[#00d4ff]"} border-t-transparent animate-[spin_1.5s_linear_infinite]`}
                      ></div>
                      <div
                        className={`text-3xl font-black italic mono ${vsMode ? "text-[#ff00ff] glow-text-magenta" : "text-[#00d4ff] glow-text-cyan"} -rotate-45`}
                      >
                        {Math.floor(loadingProgress)}%
                      </div>
                    </div>
                  </div>
                  <TacticalTerminal
                    teamName={vsMode ? `${teamName} VS ${team2Name}` : teamName}
                    game={game}
                    status={loadingStatus}
                  />
                </div>
              )}

              {/* Show Comparison Result */}
              {comparisonResult && (
                <ComparisonView comparison={comparisonResult} />
              )}

              {/* Show Single Team Report */}
              {state.report && !comparisonResult && (
                <ReportView report={state.report} gridData={state.gridData} />
              )}
            </>
          )}

          {currentView === "TELEMETRY" &&
            (comparisonResult ? (
              <VSTelemetryView comparison={comparisonResult} />
            ) : state.report ? (
              <TelemetryView report={state.report} gridData={state.gridData} />
            ) : (
              <PlaceholderView
                title="TELEMETRY_STREAM"
                icon={<Network size={48} />}
                message="Generate a scouting report first to view telemetry data. Navigate to SCOUT and analyze a team."
              />
            ))}

          {currentView === "METRICS" &&
            (comparisonResult ? (
              <VSMetricsView comparison={comparisonResult} />
            ) : state.report ? (
              <MetricsView
                report={state.report}
                gridData={state.gridData}
                onSearch={(name) => {
                  handleGenerate(name);
                  setCurrentView("SCOUT");
                }}
              />
            ) : (
              <PlaceholderView
                title="PERFORMANCE_METRICS"
                icon={<Cpu size={48} />}
                message="Generate a scouting report first to view performance metrics. Navigate to SCOUT and analyze a team."
              />
            ))}

          {currentView === "INTEL" &&
            (comparisonResult ? (
              <VSIntelView comparison={comparisonResult} />
            ) : state.report ? (
              <IntelView report={state.report} gridData={state.gridData} />
            ) : (
              <PlaceholderView
                title="CLASSIFIED_INTEL"
                icon={<Lock size={48} />}
                message="Generate a scouting report first to access classified intelligence. Navigate to SCOUT and analyze a team."
              />
            ))}

          {currentView === "ARCHIVE" && (
            <PlaceholderView
              title="DATA_ARCHIVE"
              icon={<HardDrive size={48} />}
              message="Local storage mount point initialized. No historical records found in current session."
            />
          )}
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-[100] group no-print">
        <div
          className="bg-black/80 border border-white/20 px-3 py-1.5 flex items-center gap-2 hover:border-[#00d4ff] transition-all cursor-default backdrop-blur-md bracket-container"
          title="Built with JetBrains IDE and Junie AI Coding Agent for accelerated development"
        >
          <Sparkles size={12} className="text-[#ff00ff]" />
          <div className="text-[10px] font-black text-white mono">
            JB + Junie
          </div>
          <div className="h-3 w-[1px] bg-white/20"></div>
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-[#00d4ff] transition-colors mono">
            AI-Powered Dev
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
