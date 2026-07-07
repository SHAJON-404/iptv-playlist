# 🌍 IPTV Docs

This repository hosts the official documentation, curated channel databases, and serves them via a Next.js API web server. It provides the playlists in structured **JSON** format, compatible with the [IPTV Player](https://github.com/SHAJON-404/iptv) project.

---

## 📺 Synchronized API Endpoints (Live Server)

When the server is running, you can access your dynamically compiled playlists using the following local or deployed API routes:

* **Available Playlists Directory (JSON)**: `/available_playlist.json`
* **Fifa World Cup**: `/playlist/fifa.json`
* **Sports Channel List**: `/playlist/sports.json`
* **Universal Channel List**: `/playlist/channels.json`
* **Bangla Channel List**: `/playlist/bangla.json`

---

## 📥 IPTV Player Application Download

You can download the desktop application directly from the **Download Page**:
* **Download Page**: `/download`
* It fetches the latest application binaries (for Windows and Linux platforms) from the [IPTV Player Repository](https://github.com/SHAJON-404/iptv).

---

## 🏆 World Cup Fixtures

Inspect match schedules, times, team stats, and tournament progression:
* **Fixtures Page**: `/fixtures`
* Tracks live matches, scorelines, goalscorers, and displays the interactive knockout tree bracket.

---

## 📊 Real-Time Session & Viewer Stats API

Tracks active player viewer counts and trending channels:
* **Stats Endpoint**: `/api/iptv/stats` (GET / POST)

### 1. Send Heatbeat (POST)
Send a heartbeat log payload whenever a channel starts streaming or switches:
```json
{
    "sessionId": "demo-session-uuid-12345",
    "playingNow": {
        "name": "Demo Channel HD",
        "logo": "https://example.com/logo.png",
        "url": "https://example.com/live/stream.m3u8",
        "group": "Demo Group",
        "useProxy": true,
        "referer": "https://example.com/",
        "origin": "https://example.com"
    }
}
```

### 2. Retrieve Trending Channels (GET or POST Response)
Returns total active viewers and details of top 10 trending channels:
```json
{
    "count": 1,
    "topChannels": [
        {
            "name": "Demo Channel HD",
            "logo": "https://example.com/logo.png",
            "url": "https://example.com/live/stream.m3u8",
            "group": "Demo Group",
            "useProxy": true,
            "referer": "https://example.com/",
            "origin": "https://example.com",
            "viewers": 1
        }
    ]
}
```

---

## 🔗 Raw GitHub CDN Playlists (Fallback)

If you prefer to load files directly from GitHub's CDN without running the web server:

### 🏆 Sports Playlist (240+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-docs/main/app/data/sports.json`

### 🌍 Universal Playlist (7500+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-docs/main/app/data/channels.json`

### 🇧🇩 Bangla Playlist (100+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-docs/main/app/data/bangla.json`

### ⚽ FIFA Playlist (10+ Channels)
* **JSON Link**: `https://raw.githubusercontent.com/SHAJON-404/iptv-docs/main/app/data/fifa.json`

---

## 🚀 Getting Started

To run the Next.js sync and download server locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` or `.env.local` file:
```env
ALLOWED_DEV_ORIGINS=http://localhost:3000,https://live.shajon.dev
GITHUB_SECRETS=your_github_personal_access_token_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

### 4. Production Build & Linting
```bash
npm run lint
npm run build
```

---

## ⚙️ Automated Quality Checker

This repository features a checking script to verify stream status and ensure playlist links stay active.

### Stream Quality Checker
The `scripts/get_qualities.js` script fetches and parses channels from a source `.json` file, verifies if the streams are alive, extracts their available video resolutions (for HLS and DASH), and writes the valid streams to `app/data/fifa.json`. All invalid and dead streams are automatically discarded.

Run the quality checker manually:
```bash
npm run get-qualities channel_data/all_sports_channel.json
```

---
## ❤️ Credits

Special thanks to all IPTV open-source repository maintainers and contributors whose publicly available playlists and stream sources make this collection and player possible.

---

## ⚠️ Disclaimer & DMCA Policy

This repository does not host, store, retransmit, or own any television channels or media content. The JSON files only reference publicly available stream links collected from open-source IPTV playlists and public internet sources. Channel availability may change, expire, or stop working at any time.

For any DMCA takedown requests, please create a new issue on the [GitHub Issues](https://github.com/SHAJON-404/iptv-docs/issues) tracker or contact the developer directly. Once verified, the reported channel will be deleted from the `.json` sources instantly.

> [!IMPORTANT]
> **License & Credit Notice**: If you use this channel database or stream source list in your own projects, you **must share and display proper credit** to the original developer (**S. SHAJON**) along with a link back to this repository.
