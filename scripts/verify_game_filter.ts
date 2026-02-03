import fs from "fs";
import path from "path";
import { fetchTeamData } from "../gridService";

// Load Env
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const [key, val] = line.split("=");
    if (key && val) process.env[key.trim()] = val.trim();
  });
}

// Mock browser globals for the service
// @ts-ignore
global.import = { meta: { env: process.env } };

async function testLogic() {
  console.log("--- TESTING GAME FILTERING ---");

  console.log("\n1. Searching for 'Sentinels' in VALORANT...");
  const valData = await fetchTeamData("Sentinels", "VALORANT");
  if (valData.recentMatches.length > 0 && !valData.isDemoMode) {
    console.log(`✅ Success! Found ${valData.recentMatches.length} matches.`);
    console.log(
      `   Sample Match: ${valData.recentMatches[0].map} - ${valData.recentMatches[0].score}`,
    );
  } else {
    console.log("⚠️  Valorant search failed or returned demo data.");
  }

  console.log("\n2. Searching for 'T1' in League of Legends...");
  const lolData = await fetchTeamData("T1", "League of Legends");
  if (lolData.recentMatches.length > 0 && !lolData.isDemoMode) {
    console.log(`✅ Success! Found ${lolData.recentMatches.length} matches.`);
    console.log(
      `   Sample Match: ${lolData.recentMatches[0].map} - ${lolData.recentMatches[0].score}`,
    );
  } else {
    console.log("⚠️  LoL search failed or returned demo data.");
  }
}

testLogic();
