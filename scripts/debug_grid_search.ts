
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  });
}
const apiKey = process.env.VITE_GRID_API_KEY;

// WORKING ENDPOINT
const API_URL = 'https://api-op.grid.gg/central-data/graphql';

const SEARCH_QUERY = `
  query SearchSentinels {
    allSeries(first: 5, filter: { title: { contains: "Sentinels" } }) {
      edges {
        node {
          id
          title {
            name
          }
          startTimeScheduled
          participants {
            id
            team {
              name
            }
          }
        }
      }
    }
  }
`;

async function debugSearch() {
    console.log(`\n🔎 Debugging Search on: ${API_URL}`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey as string },
            body: JSON.stringify({ query: SEARCH_QUERY })
        });
        
        const json = await response.json();
        if (json.errors) {
            console.log("❌ Search Query Errors:");
            console.log(JSON.stringify(json.errors, null, 2));
        } else {
            console.log("✅ Search Results:");
            console.log(JSON.stringify(json.data, null, 2));
        }
    } catch (e: any) { console.error("Error:", e.message); }
}

debugSearch();
