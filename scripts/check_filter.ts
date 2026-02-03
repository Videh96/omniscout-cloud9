
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
  query IntrospectFilter {
    __type(name: "SeriesFilter") {
      inputFields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`;

async function checkFilter() {
    console.log(`\n🔎 Introspecting SeriesFilter...`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey as string },
            body: JSON.stringify({ query: QUERY })
        });
        
        const json = await response.json();
        if (json.data && json.data.__type) {
            json.data.__type.inputFields.forEach((f: any) => console.log(` - ${f.name} (${f.type.name})`));
        }
    } catch (e: any) { console.error("Error:", e.message); }
}

checkFilter();
