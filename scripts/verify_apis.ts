
import fs from 'fs';
import path from 'path';
import { fetchTeamData } from '../gridService';
import { generateScoutingReport } from '../groqService';

// 1. Load Environment Variables Manually for this Node Script
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) {
      process.env[key.trim()] = val.trim();
    }
  });
  console.log("✅ .env.local loaded into process.env");
} else {
  console.error("❌ .env.local not found!");
  process.exit(1);
}

// Mocking import.meta for Node.js execution if needed, 
// though our code has process.env fallbacks.
// @ts-ignore
global.import = { meta: { env: process.env } };

async function runTests() {
  console.log("\n--- TESTING GRID API (Esports Data) ---");
  console.log("Searching for 'sentinels'...");
  
  try {
    const gridData = await fetchTeamData('sentinels', 'VALORANT');
    
    if (gridData.isDemoMode) {
      console.warn("⚠️  GRID API returned DEMO MODE data.");
      console.warn("   This usually means the API key is invalid or the API returned a 401/403.");
    } else {
      console.log("✅ GRID API Success!");
      console.log(`   Win Rate: ${gridData.teamStats.winRate}`);
      console.log(`   Matches Found: ${gridData.recentMatches.length}`);
      console.log("   First Match Map:", gridData.recentMatches[0]?.map);
    }

    console.log("\n--- TESTING GROQ API (AI Analysis) ---");
    console.log("Generating Scouting Report...");

    const report = await generateScoutingReport('sentinels', 'VALORANT', 5, gridData);
    
    console.log("✅ GROQ API Success!");
    console.log("   Report Title/Team:", report.teamName);
    console.log("   Overall Strategy:", report.overallStrategy.macroPatterns.substring(0, 100) + "...");
    
  } catch (error: any) {
    console.error("\n❌ TEST FAILED:", error.message);
    if (error.response) {
        console.error("Response status:", error.response.status);
    }
  }
}

runTests();
