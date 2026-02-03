# 🎯 Omniscout - Automated Esports Scouting Report Generator

> **Cloud9 x JetBrains Hackathon Submission - Category 2: Automated Scouting Report Generator**

[![Category](https://img.shields.io/badge/Category-2%3A%20Scouting%20Report-blue)](https://cloud9.devpost.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![GRID API](https://img.shields.io/badge/Data-GRID%20Esports%20API-orange)](https://grid.gg)
[![AI](https://img.shields.io/badge/AI-Groq%20LLM-purple)](https://groq.com)

Omniscout is an **automated scouting report generator** that leverages **GRID esports data** and **AI analysis** to provide instant, tactical breakdowns of opponent teams in **VALORANT** and **League of Legends**.

---

## 🎮 Try It Live

```bash
npm install
npm run dev
# Open http://localhost:3000
```

**Example Searches:**
- Teams: `Sentinels`, `Cloud9`, `Fnatic`, `LOUD`, `DRX`, `Paper Rex`
- Players: `TenZ`, `Aspas`, `Derke` (auto-resolves to team)

**VS Mode:** Click the ⚔️ button to compare two teams head-to-head!

---

## ✨ Features

### Core Scouting Report
- **Team-wide Strategies:** Macro patterns, objective priority, early-game aggression analysis
- **Player Tendencies:** Role identification, agent pools, KDA, exploitable habits
- **Compositions:** Top-played team compositions with win rates and occurrence %
- **"How to Win" Insights:** AI-generated counter-strategies based on opponent weaknesses

### VS Mode (Head-to-Head Comparison)
- **Scout View:** Win prediction, AI verdict, advantage analysis
- **Telemetry View:** Side-by-side radar charts, economy comparison, map pool overlap
- **Metrics View:** Player roster matchups, role duels, star player comparison
- **Intel View:** Strength/weakness comparison, counter-draft recommendations

### Data & Intelligence
- **GRID API Only:** 100% real esports data (no mock/demo data)
- **Patch Awareness:** Current meta context injected into AI analysis
- **Click-to-Search:** Click any player name to scout their team

### Export
- **PDF Dossier:** Print-optimized scouting report for coaching staff

---

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` in the project root:
```env
VITE_GRID_API_KEY=your_grid_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Metric Calculation Logic

Due to GRID Series API access tier, metrics are calculated using deterministic proxies:

| Metric | Formula | Description |
|--------|---------|-------------|
| **Tempo Aggression** | `Base(30) + (WinRate × 65)` | Winning teams dictate pace |
| **Threat Level** | Based on Win Rate | CRITICAL (>75%), ELEVATED (>60%), MODERATE (>40%), LOW (<40%) |
| **Confidence Score** | Based on sample size | 10 matches: 96%, 5 matches: 82%, 3 matches: 65% |

---

## 🏗️ Architecture

| Layer | Technology |
|-------|------------|
| **Frontend** | React (TypeScript), Vite, Tailwind CSS |
| **Data** | GRID Central Data API (GraphQL) |
| **AI** | Groq API (LLM for tactical analysis) |
| **Charts** | Recharts |

---

## 🤖 AI Development Workflow

This project was developed using **JetBrains Junie AI Coding Agent**. See [JUNIE.md](JUNIE.md) for detailed documentation on AI-assisted development.

---

## 📁 Project Structure

```
omniscout/
├── App.tsx              # Main application component
├── gridService.ts       # GRID API integration
├── groqService.ts       # Groq AI integration
├── comparisonService.ts # VS Mode comparison logic
├── components/
│   ├── ReportView.tsx      # Scout dossier view
│   ├── TelemetryView.tsx   # Telemetry data view
│   ├── MetricsView.tsx     # Player metrics view
│   ├── IntelView.tsx       # Tactical intel view
│   ├── ComparisonView.tsx  # VS Mode scout view
│   ├── VSTelemetryView.tsx # VS Mode telemetry
│   ├── VSMetricsView.tsx   # VS Mode metrics
│   └── VSIntelView.tsx     # VS Mode intel
└── types.ts             # TypeScript interfaces
```

---

## 📹 Demo Video

> [!NOTE]
> Demo video link: `[TO BE ADDED ON DEVPOST]`

---

## 📜 License

This project is open source under the [MIT License](LICENSE).

---

*Built for the Cloud9 x JetBrains Hackathon 2026* 🎮