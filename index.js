import cors from "cors";
const express = require("express");
const app = express();
require("dotenv").config();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
