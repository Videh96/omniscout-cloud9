const GRID_API_URL = "https://api-op.grid.gg/central-data/graphql";
const API_KEY = "JkGgzZIt878R3q7KO0aPRqIZmfw1A5ZXoBEzXNLf"; 

async function testGridConnection() {
  console.log("Testing GRID API Connection (Safe Query)...");

  // This is the EXACT query currently in gridService.ts
  const query = `
    query CheckAllGames {
      allGames(first: 3) {
        edges {
          node {
            id
            state
            winner {
              name
            }
          }
        }
      }
    }
  `;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const variables = {
    filter: {
      startTimeScheduled: {
        gte: sixMonthsAgo.toISOString(),
      },
    },
  };

  try {
    const response = await fetch(GRID_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ query, variables }),
    });

    const text = await response.text();
    console.log("Response Body:", text.substring(0, 500));
    
    const json = JSON.parse(text);
    if (json.errors) {
       console.error("GRAPHQL SCHEMA ERROR:", JSON.stringify(json.errors, null, 2));
    } else {
       console.log("SUCCESS! Query is valid.");
    }

  } catch (e) {
    console.error("NETWORK ERROR:", e);
  }
}

testGridConnection();