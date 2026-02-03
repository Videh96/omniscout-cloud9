import fs from 'fs';
import path from 'path';

// 1. Load Environment Variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) {
      process.env[key.trim()] = val.trim();
    }
  });
}

const apiKey = process.env.VITE_GRID_API_KEY;
if (!apiKey) {
    console.error("❌ No API Key found in .env.local");
    process.exit(1);
}

// 2. Define Endpoints to Test
const ENDPOINTS = [
    'https://api.grid.gg/central-data/graphql',
    'https://api-op.grid.gg/central-data/graphql'
];

// 3. Define a "Hello World" Query
const SIMPLE_QUERY = `
  query HelloGrid {
    allSeries(first: 1) {
      edges {
        node {
          id
          title {
            name
          }
        }
      }
    }
  }
`;

async function testConnection(url: string) {
    console.log(`\nTesting Endpoint: ${url}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey as string
            },
            body: JSON.stringify({ query: SIMPLE_QUERY })
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        
        try {
            const json = JSON.parse(text);
            if (json.errors) {
                console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
                return false;
            }
            if (json.data) {
                console.log("✅ SUCCESS! Data received:");
                console.log(JSON.stringify(json.data, null, 2));
                return true;
            }
        } catch (e) {
            console.error("Raw Body (Not JSON):", text.substring(0, 200));
        }
    } catch (e: any) {
        console.error("Network Error:", e.message);
    }
    return false;
}

async function run() {
    console.log("--- GRID API Connectivity Check ---");
    let success = false;
    
    for (const url of ENDPOINTS) {
        if (await testConnection(url)) {
            success = true;
            console.log(`\n🏆 CONCLUSION: The app CAN fetch data using endpoint: ${url}`);
            break;
        }
    }

    if (!success) {
        console.log("\n❌ CONCLUSION: The app CANNOT fetch data with this key. All endpoints failed.");
    }
}

run();