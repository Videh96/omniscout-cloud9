import { ScoutingReport, GridTeamData, GameType } from "./types";
import { getPatchContext, getCurrentPatch } from "./patchService";
import {
  calculateAggression,
  calculateConfidence,
  calculateThreatLevel,
} from "./metricsEngine";
import { APP_CONFIG } from "./constants";

const GROQ_URL = APP_CONFIG.GROQ_API_URL;

export const generateScoutingReport = async (
  teamName: string,
  game: GameType,
  matches: number,
  gridData: GridTeamData | null,
): Promise<ScoutingReport> => {
  const apiKey = process.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY missing. Please check .env.local configuration.",
    );
  }

  const systemPrompt = `You are Cloud9's elite esports analyst. Your job is to identify EXPLOITABLE WEAKNESSES in opponent teams or players.

CRITICAL REQUIREMENTS:
1. **Target Identification**: 
   - If the search term "${teamName}" is a PLAYER, focus the report on that individual while providing team context.
   - If it is a TEAM, provide a holistic roster analysis.
   - Use REAL player IGNs from the ${game} pro scene.

2. **ALWAYS identify 2-3 SPECIFIC weaknesses** - NEVER say "No weakness identified"
   - For players: Focus on mechanical slips, champion pool limits, or positioning errors.
   - For teams: Focus on macro rotations, objective setups, or coordination gaps.

3. **Use concrete tactical details**:
   - Map locations (e.g., "B Main", "Mid", "Baron pit")
   - Timing windows (e.g., "0:45 second default", "Level 6 power spike")
   - Agent/Champion specific counters

4. **Base analysis on pro scene knowledge**:
   - If GRID data is available, use it
   - If not, use your knowledge of ${teamName}'s playstyle in ${game}
   - Reference recent tournament performances

DATA CONTEXT:
${gridData ? JSON.stringify(gridData, null, 2) : "No GRID data available - generate report based on the team/player name provided"}

${getPatchContext(game)}


REQUIRED JSON STRUCTURE:
{
  "teamName": "${teamName}",
  "game": "${game}",
  "lastMatches": ${matches},
  "overallStrategy": {
    "macroPatterns": "Detailed description of their macro strategy (e.g., 'Heavy mid-control focus with late rotations')",
    "objectivePriority": "High" | "Medium" | "Low",
    "earlyGameAggression": 0-100
  },
  "playerProfiles": [
    {
      "name": "REAL_IGN_HERE (e.g., TenZ, Faker, Aspas)",
      "role": "Duelist|Initiator|Controller|Sentinel|Top|Jungle|Mid|ADC|Support",
      "mostPlayed": ["Agent1", "Agent2"],
      "kda": "1.42",
      "tendency": "SPECIFIC exploitable habit (e.g., 'Always peeks mid on pistol rounds')",
      "winRate": 65
    }
  ],
  "topCompositions": [
    {
      "agents": ["Jett", "Sova", "Omen", "Killjoy", "Sage"],
      "playStyle": "Specific style (e.g., 'Split-push heavy', 'Rush B default')",
      "winRate": 72,
      "occurrence": 68
    }
  ],
  "tacticalInsights": {
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": [
      "MANDATORY: Specific weakness 1 with tactical details",
      "MANDATORY: Specific weakness 2 with map/timing info"
    ],
    "howToWin": "Concrete counter-strategy (e.g., 'Exploit their weak A-site retakes by forcing 5v4 post-plants')",
    "counterPicks": ["Champion/Agent 1 (Reason)", "Champion/Agent 2 (Reason)"],
    "winCondition": "The specific condition required to win (e.g., 'Shut down the bottom lane early to deny their late-game insurance')",
    "confidenceScore": 85,
    "threatLevel": "CRITICAL"
  },
  "sources": [{"uri": "https://vlr.gg", "title": "VLR.gg Match History"}]
}

VALIDATION RULES:
- ❌ REJECT if player names contain "Player_", "Sample_", or numbers
- ❌ REJECT if weaknesses array is empty or says "No weakness"
- ✅ ACCEPT only if weaknesses are specific and exploitable
- ✅ INCLUDE specific counter-picks (Agents/Champions) that work well against their tendencies
- ✅ ENSURE confidenceScore is between 0-100 based on data quality (GRID data = higher)
- ✅ ASSIGN threatLevel based on number/severity of exploits found`;

  const userPrompt = `Generate a tactical scouting report for **${teamName}** in ${game}.

REQUIREMENTS:
- Use REAL player names from ${teamName}'s roster
- Identify AT LEAST 2 specific tactical weaknesses
- Include concrete counter-strategies with map/timing details
- Base analysis on the provided GRID match data

Analyze ${matches} matches worth of data and provide actionable intelligence.`;

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 6000,
        response_format: { type: "json_object" },
      }),
    });

    if (response.status === 401) {
      throw new Error("Invalid Groq API key (401 Unauthorized)");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq");
    }

    const report = JSON.parse(content) as ScoutingReport;

    // Overwrite AI estimations with deterministic calculations
    report.overallStrategy.earlyGameAggression = calculateAggression(gridData);
    report.tacticalInsights.confidenceScore = calculateConfidence(matches);
    report.tacticalInsights.threatLevel = calculateThreatLevel(gridData);

    return report;
  } catch (e) {
    console.error("Groq Generation Error:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error(`AI Report Failed: ${errorMessage}`);
  }
};
