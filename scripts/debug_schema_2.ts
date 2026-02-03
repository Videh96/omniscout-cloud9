
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

// Introspect TeamParticipant
const INTROSPECTION_QUERY = `
  query IntrospectTeamParticipant {
    __type(name: "TeamParticipant") {
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`;

async function debugSchema() {
    console.log(`\n🔎 Introspecting TeamParticipant on: ${API_URL}`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey as string },
            body: JSON.stringify({ query: INTROSPECTION_QUERY })
        });
        
        const json = await response.json();
        if (json.data && json.data.__type) {
            console.log("✅ TeamParticipant Fields:");
            json.data.__type.fields.forEach((f: any) => console.log(` - ${f.name} (${f.type.kind} ${f.type.name})`));
        } else {
            console.log("❌ Introspection failed:", JSON.stringify(json, null, 2));
        }
    } catch (e: any) { console.error("Error:", e.message); }
}

debugSchema();
