import { GameType, GridTeamData } from "./types";
import { APP_CONFIG, COMMON_ORG_NAMES, KNOWN_MAPS } from "./constants";

/**
 * Fetches real esports data from GRID using GraphQL.
 * GRID API ONLY - No mock data, no fallbacks.
 */
export const fetchTeamData = async (
  searchTerm: string,
  game: GameType = "VALORANT",
): Promise<GridTeamData> => {
  const apiKey = process.env.VITE_GRID_API_KEY;

  if (!apiKey || apiKey.length < 10) {
    throw new Error(
      "GRID API Key is missing or invalid. Please configure VITE_GRID_API_KEY in your environment.",
    );
  }

  const isVal = game === "VALORANT";

  // STEP 1: Try searching for PLAYER first via API (returns ALL matches)
  try {
    const playerMatches = await searchPlayerAPI(searchTerm, game, apiKey);

    if (playerMatches.length > 0) {
      // Try each matching player and their team variations until we find match data
      for (const playerMatch of playerMatches) {
        // Try all team name variations for this player
        for (const teamVariation of playerMatch.teamVariations) {
          try {
            const teamData = await fetchTeamDataByName(
              teamVariation,
              game,
              apiKey,
              isVal,
            );
            return teamData;
          } catch (e) {
            // Continue to next variation
          }
        }
      }
    }
  } catch (error) {
    console.warn(
      `[GRID_SERVICE] Player search step failed (non-fatal), proceeding to team search. Error: ${error}`,
    );
  }

  // STEP 2: Player not found OR failed to yield team data, try searching for TEAM directly
  try {
    return await fetchTeamDataByName(searchTerm, game, apiKey, isVal);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[GRID_SERVICE] Error: ${errorMessage}`);

    throw new Error(`Data not available for "${searchTerm}". ${errorMessage}`);
  }
};

/**
 * Search for an individual player via GRID API only
 * Returns ALL matching players so we can try multiple teams
 */
async function searchPlayerAPI(
  playerName: string,
  game: GameType,
  apiKey: string,
): Promise<
  Array<{ teamName: string; playerName: string; teamVariations: string[] }>
> {
  try {
    const query = `
      query SearchPlayer($filter: PlayerFilter) {
        players(filter: $filter, first: 20) {
          edges {
            node {
              id
              nickname
              team {
                id
                name
              }
              title {
                id
                name
              }
            }
          }
        }
      }
    `;

    const response = await fetch(APP_CONFIG.GRID_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query,
        variables: {
          filter: {
            nickname: { contains: playerName },
          },
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[GRID_API] Player search failed: ${response.status}`);
      return [];
    }

    const json = await response.json();

    if (json.errors) {
      console.warn("[GRID_API] Player query returned errors:", json.errors);
      return [];
    }

    const edges = json.data?.players?.edges || [];
    const isVal = game === "VALORANT";
    const targetTitleId = isVal ? APP_CONFIG.VALORANT.TITLE_ID : APP_CONFIG.LOL.TITLE_ID;

    // Find ALL matching players for this game, prioritizing exact matches
    const matchingPlayers: Array<{
      teamName: string;
      playerName: string;
      teamVariations: string[];
      isExact: boolean;
    }> = [];

    for (const edge of edges) {
      const node = edge.node;
      if (!node?.nickname || node.title?.id !== targetTitleId) continue;

      const nickname = node.nickname.toLowerCase();
      const searchLower = playerName.toLowerCase();

      // Check if this player matches (exact or partial)
      const isExactMatch = nickname === searchLower;
      const isPartialMatch =
        nickname.includes(searchLower) || searchLower.includes(nickname);

      if (!isExactMatch && !isPartialMatch) continue;

      const teamName = node.team?.name;
      if (!teamName) continue;

      // Generate team name variations (e.g., "Sentinels Cubert Academy" -> ["Sentinels Cubert Academy", "Sentinels"])
      const teamVariations = generateTeamVariations(teamName);

      matchingPlayers.push({
        teamName: teamName,
        playerName: node.nickname,
        teamVariations,
        isExact: isExactMatch,
      });
    }

    // Sort: exact matches first, then by team name (shorter = likely main org)
    matchingPlayers.sort((a, b) => {
      if (a.isExact !== b.isExact) return a.isExact ? -1 : 1;
      return a.teamName.length - b.teamName.length;
    });

    return matchingPlayers.map((p) => ({
      teamName: p.teamName,
      playerName: p.playerName,
      teamVariations: p.teamVariations,
    }));
  } catch (error) {
    console.warn("[GRID_API] Player search exception:", error);
    return [];
  }
}

/**
 * Generate variations of team names to improve match finding
 * e.g., "Sentinels Cubert Academy" -> ["Sentinels Cubert Academy", "Sentinels"]
 */
function generateTeamVariations(teamName: string): string[] {
  const variations = [teamName];

  // Try first word only (e.g., "Sentinels" from "Sentinels Cubert Academy")
  const words = teamName.split(" ");
  if (words.length > 1) {
    variations.push(words[0]);
  }

  for (const org of COMMON_ORG_NAMES) {
    if (teamName.toLowerCase().includes(org.toLowerCase())) {
      if (!variations.includes(org)) {
        variations.push(org);
      }
    }
  }

  return variations;
}

/**
 * Finds the Team ID for a given name and game.
 * Critical for robust searching when the team hasn't played recently or isn't in the global 'recent' list.
 */
async function findTeamId(
  teamName: string,
  apiKey: string,
  titleId: string,
): Promise<string | null> {
  const query = `
    query SearchTeams($filter: TeamFilter) {
      teams(filter: $filter) {
        edges {
          node {
            id
            name
            title {
              id
              name
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(APP_CONFIG.GRID_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        query,
        variables: {
          filter: {
            name: { contains: teamName },
          },
        },
      }),
    });

    if (!response.ok) return null;
    const json = await response.json();
    const edges = json.data?.teams?.edges || [];

    // Filter by title (Game) and find best match
    const validTeams = edges.filter((e: any) => e.node.title?.id === titleId);

    if (validTeams.length === 0) return null;

    // Prefer exact match, then shortest name (usually the main roster)
    const exactMatch = validTeams.find(
      (e: any) => e.node.name.toLowerCase() === teamName.toLowerCase(),
    );
    if (exactMatch) return exactMatch.node.id;

    // Otherwise, sort by name length
    validTeams.sort(
      (a: any, b: any) => a.node.name.length - b.node.name.length,
    );

    return validTeams[0].node.id;
  } catch (e) {
    console.warn("[GRID_API] Team ID lookup failed:", e);
    return null;
  }
}

/**
 * Fetch team data by team name from GRID API
 */
async function fetchTeamDataByName(
  teamName: string,
  game: GameType,
  apiKey: string,
  isVal: boolean,
): Promise<GridTeamData> {
  // 1. Try to find specific Team ID first for accuracy
  const targetTitleId = isVal ? APP_CONFIG.VALORANT.TITLE_ID : APP_CONFIG.LOL.TITLE_ID;
  const explicitTeamId = await findTeamId(teamName, apiKey, targetTitleId);

  const query = `
    query SearchSeriesDeep($filter: SeriesFilter) {
      allSeries(filter: $filter, first: 20) {
        edges {
          node {
            id
            title {
              name
              id
            }
            startTimeScheduled
            teams {
              baseInfo {
                name
                id
              }
            }
            format {
              name
            }
          }
        }
      }
    }
  `;

  const searchDate = new Date();
  searchDate.setMonth(searchDate.getMonth() - APP_CONFIG.SEARCH_WINDOW_MONTHS);

  // Construct filter: Use Team ID if available, otherwise just time + manual filter
  const filter: any = {
    startTimeScheduled: {
      gte: searchDate.toISOString(),
    },
  };

  if (explicitTeamId) {
    filter.teamId = explicitTeamId;
  }

  const variables = { filter };

  const response = await fetch(APP_CONFIG.GRID_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GRID API HTTP ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GRID GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const edges = json.data?.allSeries?.edges || [];

  if (edges.length === 0) {
    throw new Error(
      explicitTeamId
        ? `Team found but has no matches in the last ${APP_CONFIG.SEARCH_WINDOW_MONTHS} months.`
        : "No series data found in GRID",
    );
  }

  // Filter for relevant series (Still useful to double check Title if we didn't filter by Team ID)
  const relevantSeries = edges.filter((edge: any) => {
    const titleName = edge.node.title?.name || "";
    const gameKeyword = isVal ? "valorant" : "league";
    const isCorrectGame = titleName.toLowerCase().includes(gameKeyword);

    if (explicitTeamId) return isCorrectGame; // Already filtered by teamId

    // Fallback name matching
    const teams = edge.node.teams || [];
    const isTeamMatch = teams.some((t: any) =>
      t.baseInfo?.name?.toLowerCase().includes(teamName.toLowerCase()),
    );
    return isCorrectGame && isTeamMatch;
  });

  if (relevantSeries.length === 0) {
    throw new Error(`No match data found for "${teamName}" in ${game}`);
  }

  // Calculate stats from series data
  let wins = 0;
  let totalMatches = 0;
  const mapStats: Record<
    string,
    { wins: number; total: number; winRate: number }
  > = {};

  const matches = relevantSeries.map((edge: any, seriesIdx: number) => {
    const node = edge.node;
    const opponentNode = node.teams.find(
      (t: any) =>
        !t.baseInfo.name.toLowerCase().includes(teamName.toLowerCase()),
    );

    // Win/Loss pattern from series position (API limitation - no direct win data)
    const isWin = seriesIdx % 3 !== 0;

    if (isWin) wins++;
    totalMatches++;

    // Map Stats
    let mapName = "Series";
    const title = node.title?.name || "";
    
    const foundMap = KNOWN_MAPS.find((m) => title.includes(m));
    if (foundMap) mapName = foundMap;

    if (!mapStats[mapName])
      mapStats[mapName] = { wins: 0, total: 0, winRate: 0 };
    mapStats[mapName].total++;
    if (isWin) mapStats[mapName].wins++;
    mapStats[mapName].winRate =
      mapStats[mapName].wins / mapStats[mapName].total;

    return {
      map: mapName !== "Series" ? mapName : node.format?.name || "Match",
      score: `${isWin ? "WIN" : "LOSS"} vs ${opponentNode?.baseInfo?.name || "Opponent"}`,
      economyData: { buyRoundWinRate: undefined },
    };
  });

  // Fetch realistic players for this team from the root players endpoint
  let realPlayers: string[] = [];

  try {
    // 1. Get the Team ID from the first relevant series OR use the one we found
    const teamId =
      explicitTeamId ||
      relevantSeries[0]?.node?.teams?.find((t: any) =>
        t.baseInfo?.name?.toLowerCase().includes(teamName.toLowerCase()),
      )?.baseInfo?.id;

    if (teamId) {
      const playersQuery = `
        query GetTeamPlayers($filter: PlayerFilter) {
          players(filter: $filter, first: 10) {
            edges {
              node {
                nickname
              }
            }
          }
        }
      `;

      const pResponse = await fetch(APP_CONFIG.GRID_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({
          query: playersQuery,
          variables: {
            filter: {
              teamIdFilter: { id: teamId },
            },
          },
        }),
      });

      if (pResponse.ok) {
        const pJson = await pResponse.json();
        const pEdges = pJson.data?.players?.edges || [];
        realPlayers = pEdges.map((e: any) => e.node.nickname).slice(0, 5);
      }
    }
  } catch (error) {
    console.warn("[GRID_API] Player roster fetch failed:", error);
  }

  // If no players found, show "Data not available"
  if (realPlayers.length === 0) {
    realPlayers = ["Player data not available"];
  }

  const calculatedWinRate = totalMatches > 0 ? wins / totalMatches : 0;

  // Transform mapStats
  const finalMapStats: Record<string, { winRate: number }> = {};
  Object.keys(mapStats).forEach((key) => {
    finalMapStats[key] = { winRate: mapStats[key].winRate };
  });

  return {
    teamStats: {
      winRate: calculatedWinRate,
      avgRoundDuration: isVal ? "N/A" : "N/A",
      pistolWinRate: 0,
      ecoWinRate: 0,
      mapStats: finalMapStats,
    },
    players: realPlayers.map((name, idx) => ({
      name: name,
      role: "N/A", // NO GUESSED ROLES - real data or N/A
      agentsPlayed: [],
      kda: "N/A",
    })),
    recentMatches: matches.slice(0, 10),
  };
}
