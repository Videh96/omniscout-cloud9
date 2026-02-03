
export type GameType = 'VALORANT' | 'League of Legends';

export interface PlayerStats {
  name: string;
  role: string;
  mostPlayed: string[];
  kda: string;
  tendency: string;
  winRate: number;
}

export interface Composition {
  agents: string[];
  playStyle: string;
  winRate: number;
  occurrence: number;
}

export interface ScoutingReport {
  teamName: string;
  game: GameType;
  lastMatches: number;
  overallStrategy: {
    macroPatterns: string;
    objectivePriority: string;
    earlyGameAggression: number; // 1-100
  };
  playerProfiles: PlayerStats[];
  topCompositions: Composition[];
  tacticalInsights: {
    strengths: string[];
    weaknesses: string[];
    howToWin: string;
    counterPicks?: string[];
    winCondition?: string;
    confidenceScore: number;
    threatLevel: "CRITICAL" | "ELEVATED" | "MODERATE" | "LOW";
  };
  sources?: { uri: string; title: string }[];
}

export interface GridTeamData {
  teamStats: {
    winRate: number;
    avgRoundDuration: string;
    pistolWinRate: number;
    ecoWinRate?: number;
    mapStats?: Record<string, { winRate: number }>;
  };
  players: Array<{
    name: string;
    role: string;
    agentsPlayed: string[];
    kda: string;
  }>;
  recentMatches: Array<{
    map: string;
    score: string;
    economyData: any;
  }>;
}

export interface AppState {
  isGenerating: boolean;
  report: ScoutingReport | null;
  gridData: GridTeamData | null;
  error: string | null;
}
