import { GameType } from "./types";

/**
 * Patch/Meta awareness service for providing current game context to AI analysis
 */

export interface PatchInfo {
    version: string;
    date: string;
    game: GameType;
    highlights: string[];
    metaTier: Record<string, "S" | "A" | "B" | "C">;
}

// Current patch data (updated for hackathon demo)
const VALORANT_PATCH: PatchInfo = {
    version: "9.12",
    date: "2026-01-28",
    game: "VALORANT",
    highlights: [
        "Clove: Meddle cooldown increased 12s → 14s",
        "Cypher: Trapwire range increased by 1m",
        "Omen: Dark Cover smoke duration 15s → 17s",
        "Split: A Main box adjusted for defender visibility"
    ],
    metaTier: {
        // Duelists
        "Jett": "S", "Raze": "A", "Reyna": "B", "Phoenix": "B", "Neon": "A", "Yoru": "B", "Iso": "B", "Clove": "A",
        // Initiators
        "Sova": "A", "Breach": "B", "Skye": "A", "KAY/O": "A", "Fade": "S", "Gekko": "A",
        // Controllers
        "Brimstone": "B", "Omen": "A", "Viper": "S", "Astra": "B", "Harbor": "B",
        // Sentinels
        "Sage": "A", "Cypher": "S", "Killjoy": "A", "Chamber": "B", "Deadlock": "B", "Vyse": "A"
    }
};

const LOL_PATCH: PatchInfo = {
    version: "14.2",
    date: "2026-01-24",
    game: "League of Legends",
    highlights: [
        "Azir: Soldier damage reduced 50-170 → 45-160",
        "K'Sante: W shield strength reduced by 10%",
        "Jinx: Passive movement speed 175% → 150%",
        "Baron: Health regeneration reduced in early game"
    ],
    metaTier: {
        // Top
        "K'Sante": "S", "Aatrox": "A", "Jax": "A", "Renekton": "B", "Rumble": "A",
        // Jungle
        "Lee Sin": "S", "Viego": "A", "Jarvan IV": "A", "Rek'Sai": "B", "Maokai": "A",
        // Mid
        "Azir": "A", "Orianna": "A", "Ahri": "S", "Syndra": "A", "Corki": "B",
        // ADC
        "Jinx": "A", "Kai'Sa": "S", "Xayah": "A", "Aphelios": "A", "Varus": "B",
        // Support
        "Thresh": "S", "Nautilus": "A", "Renata": "A", "Milio": "A", "Rakan": "A"
    }
};

export const getCurrentPatch = (game: GameType): PatchInfo => {
    return game === "VALORANT" ? VALORANT_PATCH : LOL_PATCH;
};

export const getMetaTier = (game: GameType, agentOrChampion: string): "S" | "A" | "B" | "C" | "?" => {
    const patch = getCurrentPatch(game);
    return patch.metaTier[agentOrChampion] || "?";
};

export const getPatchContext = (game: GameType): string => {
    const patch = getCurrentPatch(game);
    return `
CURRENT PATCH: ${patch.version} (${patch.date})
KEY CHANGES:
${patch.highlights.map(h => `- ${h}`).join('\n')}

META TIER LIST (S-Tier):
${Object.entries(patch.metaTier)
            .filter(([_, tier]) => tier === "S")
            .map(([name]) => name)
            .join(', ')}
`;
};
