# After Hours — Your Weeknd Set

A responsive playlist builder that curates a roughly 25–35 minute set from a handpicked Weeknd catalog based on mood and situation. It works with local curation immediately, and can optionally call OpenRouter's `poolside/laguna-xs-2.1` model and create a private playlist in Spotify.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. No API key is required for local curation.

## AI curation

Open **Settings**, paste an OpenRouter API key, and save. The key is held in `sessionStorage` for the current browser tab and sent directly from the browser to OpenRouter when generating a set. It is never included in the source or saved in a project file. Clear it in Settings to remove it from the tab. The AI can only choose songs in the app's curated catalog; if the request fails, the app falls back to local curation.

Model: `poolside/laguna-xs-2.1`.

## Create the playlist in Spotify

The Spotify Web API needs a Client ID from a Spotify developer app:

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add the exact local Vite URL (usually `http://localhost:5173/`) as an allowed Redirect URI in that app.
3. In this app, open **Settings**, paste the Spotify Client ID, and choose **Connect Spotify**.
4. Approve private playlist modification. Generate a set and choose **Create & Play in Spotify**.

The app uses Spotify's browser-based PKCE authorization flow. The Client ID and short-lived access token are held in the current tab's session storage. It searches Spotify for each selected song, creates a private playlist, adds the matching tracks, and opens the playlist. If you skip Spotify setup, **Copy Tracklist** and the individual Spotify search links remain available.

## Notes

- Spotify controls which accounts can use developer apps and Web API features. The app surfaces Spotify errors if your app, account, redirect URI, or permissions are not configured for API access.
- Track times and available catalog entries are curated metadata; Spotify may have versions with slightly different durations.
- This is an independent fan project and is not affiliated with The Weeknd or Spotify.
