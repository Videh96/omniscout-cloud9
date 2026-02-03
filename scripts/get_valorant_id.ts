
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
  query FindValorantID {
    allSeries(first: 5, filter: { titleId: 3 }) {
        edges { node { title { name } } }
    }
  }
`;

// I suspect Valorant might be 1 or 2.
// Let's try to query without filter but search for "Sentinels" manually in loop
// Actually, I can just query a known Valorant match if I can.
// But easier:
// The previous success was searching for "Sentinels".
// Let's reproduce that and log the title ID.

const SENTINELS_QUERY = `
  query SearchSentinels {
    allSeries(first: 5) {
      edges {
        node {
          title {
            name
            id
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

// The problem is `allSeries` returns most recent. If Sentinels didn't play *extremely* recently, they won't be in the first 50.
// But in the previous success, they *were* found.
// "Found 3 relevant series for 'sentinels'".
// So they are in the recent list!

async function findIDs() {
    console.log(`\n🔎 Finding IDs...`);
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey as string },
        body: JSON.stringify({ query: SENTINELS_QUERY })
    });
    const json = await response.json();
    const edges = json.data?.allSeries?.edges || [];
    
    // Log all titles found
    const titles = new Map();
    edges.forEach((e: any) => {
        titles.set(e.node.title.name, e.node.title.id);
    });
    
    console.log("Titles Found in Recent 5:");
    titles.forEach((id, name) => console.log(`${name}: ${id}`));
}

findIDs();
