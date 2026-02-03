import { ScoutingReport, GridTeamData, GameType } from "./types";
import { generateScoutingReport } from "./groqService";
import { fetchTeamData } from "./gridService";
import { APP_CONFIG } from "./constants";

/**
 * Comparison Report for head-to-head team analysis
 */
export interface ComparisonReport {
    team1: {
        name: string;
        report: ScoutingReport;
        gridData: GridTeamData | null;
    };
    team2: {
        name: string;
        report: ScoutingReport;
        gridData: GridTeamData | null;
    };
    headToHead: {
        predictedWinner: string;
        confidence: number;
        keyMatchups: string[];
        advantageAreas: {
            team1: string[];
            team2: string[];
        };
        verdict: string;
    };
}

/**
 * Generate head-to-head comparison between two teams
 */
export const generateComparison = async (
    team1Name: string,
    team2Name: string,
    game: GameType,
    matches: number
): Promise<ComparisonReport> => {
    // Fetch data for both teams in parallel
    const [gridData1, gridData2] = await Promise.all([
        fetchTeamData(team1Name, game).catch(() => null),
        fetchTeamData(team2Name, game).catch(() => null)
    ]);

    // Generate reports for both teams in parallel
    const [report1, report2] = await Promise.all([
        generateScoutingReport(team1Name, game, matches, gridData1),
        generateScoutingReport(team2Name, game, matches, gridData2)
    ]);

    // Analyze head-to-head matchup
    const headToHead = analyzeHeadToHead(team1Name, team2Name, report1, report2, gridData1, gridData2);

    return {
        team1: {
            name: team1Name,
            report: report1,
            gridData: gridData1
        },
        team2: {
            name: team2Name,
            report: report2,
            gridData: gridData2
        },
        headToHead
    };
};

/**
 * Analyze head-to-head matchup between two teams
 */
function analyzeHeadToHead(
    team1Name: string,
    team2Name: string,
    report1: ScoutingReport,
    report2: ScoutingReport,
    gridData1: GridTeamData | null,
    gridData2: GridTeamData | null
): ComparisonReport["headToHead"] {
    // Calculate scores based on various factors
    const score1 = calculateTeamScore(report1, gridData1);
    const score2 = calculateTeamScore(report2, gridData2);

    const totalScore = score1 + score2;
    const team1Percentage = totalScore > 0 ? (score1 / totalScore) * 100 : 50;

    const predictedWinner = score1 > score2 ? team1Name : team2Name;
    const confidence = Math.min(95, Math.abs(team1Percentage - 50) * 2 + 50);

    // Determine advantage areas
    const team1Advantages: string[] = [];
    const team2Advantages: string[] = [];

    const aggDiff = report1.overallStrategy.earlyGameAggression - report2.overallStrategy.earlyGameAggression;
    if (aggDiff > 10) team1Advantages.push("Early game tempo");
    else if (aggDiff < -10) team2Advantages.push("Early game tempo");

    const winRate1 = gridData1?.teamStats.winRate || 0;
    const winRate2 = gridData2?.teamStats.winRate || 0;
    const wrDiff = winRate1 - winRate2;
    
    if (wrDiff > 0.1) team1Advantages.push("Recent form");
    else if (wrDiff < -0.1) team2Advantages.push("Recent form");

    if (report1.tacticalInsights.confidenceScore > report2.tacticalInsights.confidenceScore) {
        team1Advantages.push("Strategic consistency");
    } else {
        team2Advantages.push("Strategic consistency");
    }

    // Add more nuanced analysis
    if (report1.playerProfiles.length >= 5) team1Advantages.push("Full roster depth");
    if (report2.playerProfiles.length >= 5) team2Advantages.push("Full roster depth");

    // Key matchups
    const keyMatchups: string[] = [];
    // Identify carry roles generically
    const isCarry = (r: string) => 
        APP_CONFIG.VALORANT.ROLES.includes(r) || APP_CONFIG.LOL.ROLES.includes(r);

    const carry1 = report1.playerProfiles.find(p => isCarry(p.role));
    const carry2 = report2.playerProfiles.find(p => isCarry(p.role));

    if (carry1 && carry2) {
        keyMatchups.push(`${carry1.name} vs ${carry2.name} - Star player duel`);
    }

    keyMatchups.push(`${team1Name} ${report1.overallStrategy.objectivePriority} obj priority vs ${team2Name} ${report2.overallStrategy.objectivePriority}`);

    // Generate verdict
    const winnerAdvantages = predictedWinner === team1Name ? team1Advantages : team2Advantages;
    const loserWeakness = predictedWinner === team1Name ? report2.tacticalInsights.weaknesses?.[0] : report1.tacticalInsights.weaknesses?.[0];

    const verdict = `${predictedWinner} has the edge with ${winnerAdvantages.length > 0 ?
        `advantages in ${winnerAdvantages.slice(0, 2).join(' and ')}` :
        "superior adaptability"}. Key to victory: exploit opponent's ${loserWeakness || "defensive gaps"}.`;

    return {
        predictedWinner,
        confidence: Math.round(confidence),
        keyMatchups,
        advantageAreas: {
            team1: team1Advantages.length > 0 ? team1Advantages : ["Adaptability"],
            team2: team2Advantages.length > 0 ? team2Advantages : ["Adaptability"]
        },
        verdict
    };
}

/**
 * Calculate overall team score for comparison
 */
function calculateTeamScore(report: ScoutingReport, gridData: GridTeamData | null): number {
    let score = 50; // Base score

    // Win rate contribution (0-25 pts)
    const winRate = gridData?.teamStats.winRate || 0.5;
    score += winRate * 25;

    // Confidence score contribution (0-15 pts)
    score += (report.tacticalInsights.confidenceScore / 100) * 15;

    // Aggression balanced with objectives (0-10 pts)
    const aggressionBalance = Math.abs(report.overallStrategy.earlyGameAggression - 50);
    score += (50 - aggressionBalance) / 5;

    // Threat level penalty/bonus
    switch (report.tacticalInsights.threatLevel) {
        case "CRITICAL": score += 5; break;
        case "ELEVATED": score += 2; break;
        case "MODERATE": score -= 2; break;
        case "LOW": score -= 5; break;
    }

    return score;
}
