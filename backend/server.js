const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const loadIPLData = require('./routes/loadipl'); 
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

const allowedOrigins = [];

if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push('https://ipl-dashboard2.vercel.app');
} else {
  allowedOrigins.push(process.env.CLIENT_URL || 'http://localhost:3000');
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());


// --- Environment Variable Check ---
const apiKey = process.env.CRIC_API_KEY;

if (!apiKey) {
  console.error("❌ CRIC_API_KEY is missing in the .env file.");
}

app.post('/test', (req, res) => {
  const { email, password } = req.body;
  console.log("📥 Login received:", email, password); // This will also show in Wireshark
  res.send(`Welcome ${email}, password received (insecurely 😬)`);
});
app.get('/api/team-stats/:teamName', async (req, res) => {
  const teamName = req.params.teamName;
  console.log("Fetching stats for:", teamName); // Log the team name to confirm it matches

  const matches = await loadIPLData();

  const statsByYear = {};

  matches.forEach(match => {
    if (match.team1 === teamName || match.team2 === teamName) {
      const season = match.season.slice(0, 4); 
      const stage = match.match_type;
      const won = match.winner === teamName;

      if (!statsByYear[season]) statsByYear[season] = {};
      if (!statsByYear[season][stage]) {
        statsByYear[season][stage] = { matches: 0, wins: 0 };
      }

      statsByYear[season][stage].matches += 1;
      if (won) statsByYear[season][stage].wins += 1;
    }
  });

  console.log(statsByYear); // Show it in your terminal
  res.json(statsByYear); // Optionally send to frontend
});app.get('/api/team-stage-stats/:teamName', async (req, res) => {
  const teamName = req.params.teamName;
  const matches = await loadIPLData();

  const yearlyStats = {};

  matches.forEach(match => {
    if (match.team1 === teamName || match.team2 === teamName) {
      const year = new Date(match.date).getFullYear(); // or use match.season if available
      const stage = match.match_type || 'League';
      const won = match.winner === teamName;

      if (!yearlyStats[year]) yearlyStats[year] = {};
      if (!yearlyStats[year][stage]) {
        yearlyStats[year][stage] = { matches: 0, wins: 0 };
      }

      yearlyStats[year][stage].matches += 1;
      if (won) yearlyStats[year][stage].wins += 1;
    }
  });

  res.json(yearlyStats);
});

app.get('/api/featured-matches', async (req, res) => {
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") { // Added check for placeholder
    console.error("API Key is missing or not configured.");
    return res.status(500).json({ message: "Server configuration error: API Key missing or invalid." });
  }

  const currentMatchesUrl = `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`;
  console.log(`Workspaceing matches from: ${currentMatchesUrl}`); // Log the URL being used

  try {
    const response = await axios.get(currentMatchesUrl);

     let currentMatches = [];
     if (response.data && Array.isArray(response.data.data)) {
      currentMatches = response.data.data;
      console.log(`Workspaceed ${currentMatches.length} matches initially.`); // Log total matches fetched
    } else {
      console.error("Unexpected API response structure:", response.data);
      return res.status(500).json({ message: "Unexpected API response structure." });
    }

    if (currentMatches.length > 0) {
        console.log("Sample raw matches (first 5):", JSON.stringify(currentMatches.slice(0, 5), null, 2));
    } else {
        console.log("API returned an empty list of matches.");
    }


    currentMatches.sort((a, b) => {
        const dateA = a.dateTimeGMT ? new Date(a.dateTimeGMT) : new Date(0); // Use epoch if invalid
        const dateB = b.dateTimeGMT ? new Date(b.dateTimeGMT) : new Date(0);
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateA - dateB;
    });


    const indianVenues = [
      'mumbai',        // Wankhede, Brabourne, DY Patil
      'delhi',         // Arun Jaitley Stadium / Feroz Shah Kotla
      'chennai',       // M. A. Chidambaram Stadium / Chepauk
      'kolkata',       // Eden Gardens
      'hyderabad',     // Rajiv Gandhi International Stadium
      'ahmedabad',     // Narendra Modi Stadium / Motera
      'jaipur',        // Sawai Mansingh Stadium
      'lucknow',       // BRSABV Ekana Cricket Stadium
      'dharamsala',    // HPCA Stadium
      'bangalore',     // M. Chinnaswamy Stadium
      'bengaluru',     // (Alternative for Chinnaswamy)
      'pune',          // MCA Stadium
      'nagpur',        // VCA Stadium
      'rajkot'         // Saurashtra Cricket Association Stadium
      // Add more specific stadium names if city names aren't reliably in the venue string
      // 'wankhede', 'eden gardens', 'chinnaswamy', etc.
    ];

    // Filter matches played in Indian venues
    const filteredMatches = currentMatches.filter(match => {
      const venueString = typeof match.venue === 'string' ? match.venue.toLowerCase() : '';

      if (!venueString) {
        return false; // Skip matches without a venue string
      }

      const isIndianVenue = indianVenues.some(venueKeyword =>
        venueString.includes(venueKeyword)
      );


      return isIndianVenue;
    });

    console.log(`Filtered down to ${filteredMatches.length} matches in Indian venues.`); // Log count after filtering

    if (filteredMatches.length === 0 && currentMatches.length > 0) {
        console.log("No matches found matching the Indian venue criteria.");
   }

    res.status(200).json({ matches: filteredMatches });

  } catch (error) {
     console.error("❌ Error fetching or processing matches:", error); // Log the whole error object
    let errorMessage = "Failed to fetch match data.";
    if (error.response) {
         console.error("API Error Status:", error.response.status);
        console.error("API Error Data:", error.response.data);
        errorMessage = `Failed to fetch data from provider: Status ${error.response.status}`;
    } else if (error.request) {
        console.error("API No response:", error.request);
        errorMessage = "No response received from match data provider.";
    } else {
        console.error('Error Message:', error.message);
    }

    res.status(500).json({
      message: errorMessage,
       });
  }
});
app.get('/', (req, res) => {
  res.send('✅ Cricket API Backend is running. Use /api/featured-matches to get data.');
});


app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
})
// const https = require('https');
// const fs = require('fs');
// const https = require('https');
// // --- Read SSL certificate files ---
// const sslOptions = {
//   key: fs.readFileSync('./ssl/server.key'),
//   cert: fs.readFileSync('./ssl/server.cert'),
// };

// // --- Start HTTPS Server ---
// https.createServer(sslOptions, app).listen(PORT, () => {
//   console.log(`🔒 HTTPS Server running at https://localhost:${PORT}`);
// });
// ;
