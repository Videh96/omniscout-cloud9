import { GridTeamData } from "./types";

/**
 * Calculates 'Tempo Aggression' (0-100) using Win Rate as a proxy for Momentum.
 * Since raw telemetry (round timers) is unavailable in the Series API,
 * we assume high-win-rate teams dictate the pace (High Aggression).
 */
export const calculateAggression = (gridData: GridTeamData | null): number => {
    if (!gridData) return 50;

    // In the absence of round timers, Momentum is derived from Win Rate.
    // 0% WR -> 30 (Defensive/Passive)
    // 50% WR -> 65 (Standard)
    // 100% WR -> 95 (Dominant/Aggressive)
    const base = 30;
    const momentumBonus = gridData.teamStats.winRate * 65;

    return Math.min(99, Math.round(base + momentumBonus));
};

/**
 * Calculates Threat Level based on Win Rate within the selected sample window.
 */
export const calculateThreatLevel = (gridData: GridTeamData | null): "CRITICAL" | "ELEVATED" | "MODERATE" | "LOW" => {
    if (!gridData) return "MODERATE";

    const wr = gridData.teamStats.winRate;

    // Sample size context is baked into the win rate by the service before it gets here.
    if (wr >= 0.75) return "CRITICAL";     // Domination (e.g., Won 3/3 or 8/10)
    if (wr >= 0.60) return "ELEVATED";     // Strong (e.g., Won 2/3 or 6/10)
    if (wr >= 0.40) return "MODERATE";     // Average (e.g., Won 1/3 or 4-5/10)
    return "LOW";                          // Struggling
};

/**
 * Calculates Confidence Score based on the specific sample size options (3, 5, 10).
 * Smaller samples = Lower confidence (higher variance).
 */
export const calculateConfidence = (matchesAnalyzed: number): number => {
    // Exact mapping for the user's specific sample buckets
    if (matchesAnalyzed >= 10) return 96; // High certainty
    if (matchesAnalyzed >= 5) return 82;  // Good baseline
    if (matchesAnalyzed >= 3) return 65;  // Volatile but actionable

    // Fallback for custom numbers
    return Math.min(98, Math.round((matchesAnalyzed / 10) * 90));
};
