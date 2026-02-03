
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
const API_URL = 'https://api-op.grid.gg/central-data/graphql';

const QUERY = `
  query CheckTitles {
    allSeries(first: 10) {
      edges {
        node {
          id
          title {
            name
          }
          teams {
            baseInfo {
              name
            }
          }
        }
      }
    }
  }
`;

async function checkTitles() {
    console.log(`\n🔎 Checking Title Names on: ${API_URL}`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey as string },
            body: JSON.stringify({ query: QUERY })
        });
        
        const json = await response.json();
        if (json.data && json.data.allSeries) {
            json.data.allSeries.edges.forEach((e: any) => {
                const teams = e.node.teams.map((t: any) => t.baseInfo.name).join(' vs ');
                console.log(`[${e.node.title.name}] ${teams}`);
            });
        } else {
            console.log("❌ Failed:", JSON.stringify(json, null, 2));
        }
    } catch (e: any) { console.error("Error:", e.message); }
}

checkTitles();
