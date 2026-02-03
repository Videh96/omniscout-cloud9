
import { GameType } from "./types";

export const APP_CONFIG = {
    GRID_API_URL: "https://api-op.grid.gg/central-data/graphql",
    GROQ_API_URL: "https://api.groq.com/openai/v1/chat/completions",
    
    // Search Configuration
    SEARCH_WINDOW_MONTHS: 48,
    MATCH_LIMIT_DEFAULT: 10,
    
    // Thresholds for Metrics
    THRESHOLDS: {
        WIN_RATE_CRITICAL: 0.75, // 75% WR = Critical Threat
        WIN_RATE_ELEVATED: 0.60,
        WIN_RATE_MODERATE: 0.40,
        
        AGGRESSION_BASE: 30,
        AGGRESSION_MULTIPLIER: 65,
    },
    
    // Game Specifics
    VALORANT: {
        TITLE_ID: "6",
        ROLES: ["Duelist", "Initiator", "Controller", "Sentinel"]
    },
    LOL: {
        TITLE_ID: "3",
        ROLES: ["Top", "Jungle", "Mid", "ADC", "Support"]
    }
};

export const COMMON_ORG_NAMES = [
    "Sentinels", "Cloud9", "100 Thieves", "NRG", "OpTic", "LOUD", 
    "Fnatic", "Team Liquid", "G2", "Evil Geniuses", "XSET", "TSM", 
    "FaZe", "DRX", "Paper Rex", "Vitality", "Team Vitality", 
    "NAVI", "Giants", "T1", "KT Rolster", "Gen.G"
];

export const KNOWN_MAPS = [
    "Haven", "Bind", "Split", "Ascent", "Lotus", 
    "Pearl", "Sunset", "Breeze", "Icebox", "Fracture"
];
