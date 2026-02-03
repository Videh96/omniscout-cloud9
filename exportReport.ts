import { ScoutingReport, GridTeamData } from "./types";
import { TacticalAnalysis } from "./strategyEngine";
import { ComparisonReport } from "./comparisonService";

/**
 * Generates a professional PDF scouting report by creating a temporary printable window.
 * Optimizes the layout for landscape printing with dark-themed tactical aesthetics.
 */
export const exportToPDF = (
  teamName: string,
  reportData: ScoutingReport,
  tactics: TacticalAnalysis,
) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export the PDF report.");
    return;
  }

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>STRAT_DOSSIER: ${teamName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');

        :root {
          --bg: #ffffff;
          --accent-cyan: #008ba3;
          --accent-coral: #d94619;
          --accent-magenta: #b000b0;
          --accent-green: #059669;
          --text-main: #1a1a1a;
          --text-muted: #4b5563;
          --border: #e5e7eb;
        }

        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }

        body {
          background-color: var(--bg);
          color: var(--text-main);
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 50px;
          line-height: 1.5;
        }

        .header-font { font-family: 'Orbitron', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 2px solid var(--accent-cyan);
          padding-bottom: 20px;
          margin-bottom: 40px;
        }

        .branding {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #000;
        }
        .branding span { color: var(--accent-cyan); }

        .meta {
          text-align: right;
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .team-hero {
          margin-bottom: 40px;
        }

        .team-name {
          font-size: 64px;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: -2px;
          line-height: 1;
          color: #000;
        }

        .grid-stats {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }

        .grid-tag {
          font-size: 10px;
          font-weight: 900;
          background: rgba(0, 139, 163, 0.1);
          border: 1px solid var(--accent-cyan);
          color: var(--accent-cyan);
          padding: 4px 12px;
          border-radius: 2px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .box {
          padding: 25px;
          background: #f9fafb;
          border: 1px solid var(--border);
          position: relative;
        }

        .box::before {
          content: "";
          position: absolute;
          top: -1px; left: -1px; width: 10px; height: 10px;
          border-top: 2px solid var(--accent-cyan); border-left: 2px solid var(--accent-cyan);
        }

        .box-title {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .box-exploits { border-left: 4px solid var(--accent-coral); }
        .box-exploits .box-title { color: var(--accent-coral); }
        .box-exploits .box-title::before { content: "!"; }

        .box-strategy { border-left: 4px solid var(--accent-cyan); }
        .box-strategy .box-title { color: var(--accent-cyan); }
        .box-strategy .box-title::before { content: ">>"; }

        .list-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          margin-bottom: 15px;
          padding-left: 20px;
          position: relative;
          color: #374151;
        }

        .list-item::before {
          content: ">";
          position: absolute;
          left: 0;
          color: var(--accent-magenta);
          font-weight: bold;
        }

        .verdict {
          margin-top: 30px;
          padding: 20px;
          background: rgba(5, 150, 105, 0.1);
          border-left: 4px solid var(--accent-green);
          font-style: italic;
          font-weight: 700;
          color: var(--accent-green);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: #fff;
        }

        th {
          text-align: left;
          padding: 15px;
          font-size: 10px;
          font-weight: 900;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 2px;
          border-bottom: 1px solid var(--border);
        }

        td {
          padding: 20px 15px;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
        }

        .player-id { font-weight: 900; font-family: 'Orbitron'; font-style: italic; color: #000; }
        .player-role { font-size: 10px; font-weight: 900; background: var(--accent-cyan); color: #fff; padding: 2px 8px; text-transform: uppercase; }
        .player-kda { font-weight: 900; color: var(--accent-magenta); font-family: 'JetBrains Mono'; }

        .footer {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid var(--border);
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: 'JetBrains Mono';
        }

        .footer b { color: var(--accent-cyan); }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="branding header-font">CLOUD9 // <span>OMNISCOUT</span></div>
        <div class="meta mono">
          GENERATED: ${date}<br>
          CLASSIFICATION: CONFIDENTIAL_ANALYSIS
        </div>
      </div>

      <div class="team-hero">
        <h1 class="team-name header-font">${teamName}</h1>
        <div class="grid-stats">
          <div class="grid-tag">NODE: ${reportData.game}</div>
          <div class="grid-tag">WINDOW: ${reportData.lastMatches} MATCHES</div>
          <div class="grid-tag">CONFIDENCE: ${tactics.confidenceScore}%</div>
        </div>
      </div>

      <div class="section-grid">
        <div class="box box-exploits">
          <div class="box-title header-font">CRITICAL_EXPLOITS</div>
          ${tactics.keyExploits.map((e) => `<div class="list-item">${e}</div>`).join("")}
        </div>

        <div class="box box-strategy">
          <div class="box-title header-font">STRATEGIC_DIRECTIVES</div>
          ${tactics.recommendations.map((r) => `<div class="list-item">${r}</div>`).join("")}
          <div class="verdict mono">
            VERDICT: ${reportData.tacticalInsights.howToWin}
          </div>
        </div>
      </div>

      <div class="box">
        <div class="box-title header-font" style="color: var(--text-muted)">ENTITY_PROFILES</div>
        <table>
          <thead>
            <tr>
              <th>IDENTIFIER</th>
              <th>OPERATIONAL_ROLE</th>
              <th>KDA_METRIC</th>
              <th>PREFERRED_ASSETS</th>
              <th>TACTICAL_TENDENCY</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.playerProfiles
              .map(
                (p) => `
              <tr>
                <td class="player-id">${p.name}</td>
                <td><span class="player-role">${p.role}</span></td>
                <td class="player-kda">${p.kda}</td>
                <td class="mono" style="font-size: 12px; color: var(--accent-cyan)">${p.mostPlayed.join(", ")}</td>
                <td class="mono" style="font-size: 12px; color: #fff; opacity: 0.8 italic;">${p.tendency}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <div>CORE_SYSTEM: <b>GRID_OS_4.2.0</b></div>
        <div>INTEL_PARTNER: <b>JETBRAINS_JUNIE</b></div>
        <div>TERMINAL: <b>2077_BETA</b></div>
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
            // Optional: Auto-close window after print dialog is closed
            // window.onafterprint = () => window.close();
          }, 800);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

/**
 * Generates a professional PDF comparison report (VS Mode)
 */
export const exportComparisonToPDF = (comparison: ComparisonReport) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export the PDF report.");
    return;
  }

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { team1, team2, headToHead } = comparison;
  const isTeam1Winner = headToHead.predictedWinner === team1.name;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>VS_DOSSIER: ${team1.name}_VS_${team2.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');

        :root {
          --bg: #ffffff;
          --accent-cyan: #008ba3;
          --accent-coral: #d94619;
          --accent-magenta: #b000b0;
          --accent-green: #059669;
          --text-main: #1a1a1a;
          --text-muted: #4b5563;
          --border: #e5e7eb;
        }

        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }

        body {
          background-color: var(--bg);
          color: var(--text-main);
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 40px;
          line-height: 1.5;
        }

        .header-font { font-family: 'Orbitron', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 2px solid var(--accent-magenta);
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .branding {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #000;
        }
        .branding span { color: var(--accent-magenta); }

        .vs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          text-align: center;
        }

        .team-title {
          font-size: 32px;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -1px;
        }

        .vs-badge {
          font-size: 20px;
          font-weight: 900;
          background: rgba(176, 0, 176, 0.1);
          border: 1px solid var(--accent-magenta);
          color: var(--accent-magenta);
          padding: 8px 20px;
          border-radius: 4px;
          transform: skew(-10deg);
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 30px;
        }

        .team-panel {
          padding: 20px;
          background: #f9fafb;
          border: 1px solid var(--border);
          position: relative;
        }

        .team-panel.winner {
          border-color: var(--accent-green);
          background: rgba(5, 150, 105, 0.05);
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 5px;
        }

        .stat-label { font-family: 'JetBrains Mono'; font-size: 11px; color: var(--text-muted); }
        .stat-value { font-weight: 900; color: #000; }

        .verdict-box {
          margin-top: 30px;
          padding: 25px;
          background: rgba(0, 139, 163, 0.05);
          border: 1px solid var(--accent-cyan);
          text-align: center;
        }

        .verdict-title {
          color: var(--accent-cyan);
          font-weight: 900;
          letter-spacing: 2px;
          margin-bottom: 10px;
          font-size: 12px;
        }

        .verdict-text {
          font-size: 16px;
          font-weight: 700;
          color: #000;
          font-style: italic;
        }

        .footer {
          margin-top: 40px;
          border-top: 1px solid var(--border);
          padding-top: 15px;
          font-size: 10px;
          color: var(--text-muted);
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="branding header-font">CLOUD9 // <span>VS_MODE</span></div>
        <div class="meta mono">
          GENERATED: ${date}<br>
          CONFIDENCE: ${headToHead.confidence}%
        </div>
      </div>

      <div class="vs-header">
        <div class="team-title header-font" style="color: ${isTeam1Winner ? "#059669" : "#000"}">${team1.name}</div>
        <div class="vs-badge header-font">VS</div>
        <div class="team-title header-font" style="color: ${!isTeam1Winner ? "#059669" : "#000"}">${team2.name}</div>
      </div>

      <div class="comparison-grid">
        <div class="team-panel ${isTeam1Winner ? "winner" : ""}">
          <div class="stat-row"><span class="stat-label">WIN RATE</span> <span class="stat-value">${Math.round((team1.gridData?.teamStats.winRate || 0.5) * 100)}%</span></div>
          <div class="stat-row"><span class="stat-label">AGGRESSION</span> <span class="stat-value">${team1.report.overallStrategy.earlyGameAggression}/100</span></div>
          <div class="stat-row"><span class="stat-label">CONFIDENCE</span> <span class="stat-value">${team1.report.tacticalInsights.confidenceScore}%</span></div>
          <br>
          <div class="stat-label" style="color: var(--accent-cyan); margin-bottom: 5px;">ADVANTAGES</div>
          ${headToHead.advantageAreas.team1.map((a) => `<div class="mono" style="font-size: 12px; margin-bottom: 4px;">+ ${a}</div>`).join("")}
        </div>

        <div class="team-panel ${!isTeam1Winner ? "winner" : ""}">
          <div class="stat-row"><span class="stat-label">WIN RATE</span> <span class="stat-value">${Math.round((team2.gridData?.teamStats.winRate || 0.5) * 100)}%</span></div>
          <div class="stat-row"><span class="stat-label">AGGRESSION</span> <span class="stat-value">${team2.report.overallStrategy.earlyGameAggression}/100</span></div>
          <div class="stat-row"><span class="stat-label">CONFIDENCE</span> <span class="stat-value">${team2.report.tacticalInsights.confidenceScore}%</span></div>
          <br>
          <div class="stat-label" style="color: var(--accent-cyan); margin-bottom: 5px;">ADVANTAGES</div>
          ${headToHead.advantageAreas.team2.map((a) => `<div class="mono" style="font-size: 12px; margin-bottom: 4px;">+ ${a}</div>`).join("")}
        </div>
      </div>

      <div class="verdict-box">
        <div class="verdict-title header-font">PREDICTED WINNER: <span style="font-size: 18px; color: #000;">${headToHead.predictedWinner}</span></div>
        <div class="verdict-text header-font">"${headToHead.verdict}"</div>
      </div>

      <div class="footer mono">
        OMNISCOUT COMPARISON SYSTEM // GRID ESPORTS DATA
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 800);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
