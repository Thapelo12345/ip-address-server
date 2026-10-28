// import cors from "cors";
const cors = require("cors")
const express = require("express");
const app = express();
require("dotenv").config();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/location', (req, res) => {
  // 1. Safely extract the client's real IP address
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // 2. Extract Vercel's automatic geolocation data
  const location = {
    ip: typeof ip === 'string' ? ip.split(',')[0].trim() : ip,
    country: req.headers['x-vercel-ip-country'] || 'Unknown',
    region: req.headers['x-vercel-ip-country-region'] || 'Unknown',
    city: req.headers['x-vercel-ip-city'] || 'Unknown',
    latitude: req.headers['x-vercel-ip-latitude'] || 'Unknown',
    longitude: req.headers['x-vercel-ip-longitude'] || 'Unknown',
  };

  res.json(location);
});

app.get("/geo-data:IP", async (req, res) => {
const IPAddress = req.params.IP; 

  try {

    if(!IPAddress) throw new Error("Failed to pass the IP Address!.")
    const GeoResponse = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.IP_Geolocation_API}&ipAddress=${IPAddress}`,
      { method: "GET" },
    );

    console.log(GeoResponse)
    if (!GeoResponse.ok) throw new Error("Failed to connect to Server!.");
    const GeoData = await GeoResponse.json();

    res.json({message: "Geo Data Recieved successfuly", geoData: GeoData})
  } catch (err) {
    const errMessage =
      err instanceof Error ? err.message : "unknown Server Error!";
    res.json({ message: errMessage });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
});
