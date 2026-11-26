const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 10000;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_SHARED_SECRET = process.env.LASTFM_SHARED_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'lastfm-proxy' });
});

// Proxy endpoint for Last.fm API
app.all('/proxy', async (req, res) => {
  try {
    if (!LASTFM_API_KEY) {
      return res.status(500).json({ error: 'LASTFM_API_KEY not configured on proxy server' });
    }

    const queryParams = { ...req.query };
    queryParams.api_key = LASTFM_API_KEY;
    queryParams.format = 'json';

    // Build Last.fm URL
    const urlParams = new URLSearchParams(queryParams);
    const lastfmUrl = `https://ws.audioscrobbler.com/2.0/?${urlParams.toString()}`;

    const fetchOptions = {
      method: req.method,
      headers: {
        'User-Agent': 'Noctalia-Lastfm-Proxy/1.0',
      },
    };

    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      fetchOptions.body = new URLSearchParams(req.body).toString();
    }

    const response = await fetch(lastfmUrl, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'proxy_error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Last.fm proxy server running on port ${PORT}`);
});
