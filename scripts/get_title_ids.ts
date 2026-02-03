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
  query GetTitles {
    allTitles {
      id
      name
    }
  }
`;

async function getTitles() {
    console.log(`\n🔎 Getting All Titles...`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey as string },
            body: JSON.stringify({ query: QUERY })
        });
        
        const json = await response.json();
        if (json.errors) {
             // Fallback if allTitles doesn't exist (it might not be exposed)
             console.log("allTitles failed, checking series titles again with IDs...");
             checkSeriesTitles();
        } else if (json.data && json.data.allTitles) {
            console.log("✅ Titles Found:");
            json.data.allTitles.forEach((t: any) => console.log(`${t.name}: ${t.id}`));
        }
    } catch (e: any) { console.error("Error:", e.message); }
}

const SERIES_QUERY = `
  query CheckSeriesTitles {
    allSeries(first: 50) {
      edges {
        node {
          title {
            name
            id
          }
        }
      }
    }
  }
`;

async function checkSeriesTitles() {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey as string },
        body: JSON.stringify({ query: SERIES_QUERY })
    });
    const json = await response.json();
    const map = new Map();
    json.data?.allSeries?.edges?.forEach((e: any) => {
        map.set(e.node.title.name, e.node.title.id);
    });
    console.log("✅ Derived Titles from Series:");
    map.forEach((id, name) => console.log(`${name}: ${id}`));
}

getTitles();
