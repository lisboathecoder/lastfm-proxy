# Last.fm Proxy for Noctalia

A lightweight Express proxy server that wraps the Last.fm API so users don't need to configure their own Last.fm API key in the Noctalia plugin.

## Deployment on Render

1. Push this repository/folder to GitHub.
2. In the Render Dashboard, create a new **Blueprint** from your repository, or use the Render CLI / MCP tools.
3. Set the required environment variable:
   - `LASTFM_API_KEY`: Your Last.fm API key from https://www.last.fm/api/account/create
   - `LASTFM_SHARED_SECRET`: (Optional) Your Last.fm shared secret for auth/love actions.
4. Once deployed, point your Noctalia plugin endpoint to your Render service URL (e.g. `https://lastfm-proxy.onrender.com/proxy`).
