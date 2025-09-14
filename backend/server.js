const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// IMPORTANT: Ensure RAPIDAPI_KEY is set in your .env file in the backend directory
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'deezerdevs-deezer.p.rapidapi.com';

if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'YOUR_RAPIDAPI_KEY_HERE') {
  console.error('FATAL ERROR: RAPIDAPI_KEY is not set in your .env file. Please set it and restart the server.');
  process.exit(1); // Exit the process with an error code
}

console.log(`Backend starting with RAPIDAPI_HOST: ${RAPIDAPI_HOST}`);
console.log(`Backend starting with RAPIDAPI_KEY (first 10 chars): ${RAPIDAPI_KEY ? RAPIDAPI_KEY.substring(0, 10) : 'NOT SET'}`);

app.use(cors());
app.use(express.json());

app.get('/api/deezer/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const queryParams = new URLSearchParams(req.query);

const fullDeezerUrl = `https://${RAPIDAPI_HOST}/${endpoint}?${queryParams.toString()}`;
  console.log(`Proxying request to Deezer API: ${fullDeezerUrl}`);
  console.log(`Request headers: X-RapidAPI-Key: ${RAPIDAPI_KEY ? RAPIDAPI_KEY.substring(0, 10) + '...' : 'NOT SET'}, X-RapidAPI-Host: ${RAPIDAPI_HOST}`);

  try {
    const response = await axios.get(fullDeezerUrl, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("--- AXIOS CATCH BLOCK ENTERED ---");
    
    let status = 500;
    let data = "An unexpected error occurred.";

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Headers:", error.response.headers);
      status = error.response.status;
      data = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error Message:", error.message);
      data = error.message;
    }
    
    console.error("Error Config:", error.config);

    res.status(status).json({
      message: "Failed to fetch data from Deezer API",
      error: data,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy server running on port ${PORT}`);
});
