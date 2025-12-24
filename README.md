# solify - Spotify Resolver

Simple Spotify API resolver for playlists and track recommendations using Hono framework.

## Features

- 🎵 Resolve Spotify playlists
- 🎯 Get track recommendations
- 🔄 Auto token management
- ⚡ Built with Hono and Bun
- 📦 Returns standard Spotify Web API format

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure your token endpoint in `.env`:
```env
TOKEN_ENDPOINT=https://github.com/idMJA/accessify
PORT=3000
```

> [!NOTE]
> See [accessify](https://github.com/idMJA/accessify) for token endpoint setup.

## Usage

### Development
```bash
bun run dev
```

### Production
```bash
bun start
```

## API Endpoints

> [!IMPORTANT]
> Only `/playlist/full` endpoints require the `Authorization` header for direct Spotify Web API access. Other endpoints use the internal token from `TOKEN_ENDPOINT`.

### Playlist
Returns playlist tracks in standard Spotify Web API format from the Partner API.

**By ID:**
```
GET /playlist/:id
```

**By URL:**
```
GET /playlist?url=https://open.spotify.com/playlist/37i9dQZF1E35HoLL235RmS
```

**Response:**
```json
{
  "tracks": [
    {
      "album": { ... },
      "artists": [ ... ],
      "duration_ms": 223511,
      "name": "Track Name",
      "uri": "spotify:track:..."
    }
  ]
}
```

### Playlist (Full Details)
Returns up to 50 tracks with complete Spotify Web API details (includes additional fields like `popularity`, `external_ids`, `available_markets`, etc.).

> [!WARNING]
> This endpoint **requires** the `Authorization: Bearer YOUR_SPOTIFY_TOKEN` header.

> [!TIP]
> Use this endpoint when you need richer track metadata; it queries the official Spotify Web API directly.

**By ID:**
```
GET /playlist/full/:id?limit=50
Authorization: Bearer YOUR_SPOTIFY_TOKEN
```

**By URL:**
```
GET /playlist/full?url=https://open.spotify.com/playlist/37i9dQZF1E35HoLL235RmS&limit=50
Authorization: Bearer YOUR_SPOTIFY_TOKEN
```

> [!NOTE]
> Limit defaults to 50 and is clamped to 1–50 maximum. Returns 401 if Authorization header is missing.

**Response:**
```json
{
  "tracks": [
    {
      "album": {
        "album_type": "album",
        "artists": [ ... ],
        "available_markets": [ ... ],
        "external_urls": { "spotify": "..." },
        "href": "...",
        "id": "...",
        "images": [ ... ],
        "name": "Album Name",
        "release_date": "2006-06-28",
        "release_date_precision": "day",
        "total_tracks": 12,
        "type": "album",
        "uri": "..."
      },
      "artists": [ ... ],
      "available_markets": [ ... ],
      "disc_number": 1,
      "duration_ms": 366213,
      "explicit": false,
      "external_ids": { "isrc": "..." },
      "external_urls": { "spotify": "..." },
      "href": "...",
      "id": "...",
      "is_local": false,
      "name": "Track Name",
      "popularity": 70,
      "preview_url": null,
      "track_number": 11,
      "type": "track",
      "uri": "..."
    }
  ]
}
```

### Recommendations
Returns track recommendations with seeds information.

**By Track ID:**
```
GET /recommendations/:id?limit=5
```

**By Track URL:**
```
GET /recommendations?url=https://open.spotify.com/track/2TXVTQf4YZH9o0kDVUUdjj&limit=5
```

**Response:**
```json
{
  "seeds": [
    {
      "afterFilteringSize": 5,
      "afterRelinkingSize": 5,
      "href": "https://api.spotify.com/v1/tracks/...",
      "id": "...",
      "initialPoolSize": 5,
      "type": "track"
    }
  ],
  "tracks": [
    {
      "album": { ... },
      "artists": [ ... ],
      "duration_ms": 223511,
      "is_playable": true,
      "name": "Track Name",
      "uri": "spotify:track:..."
    }
  ]
}
```

## Project Structure

```
src/
├── config/
│   └── env.ts           # Environment configuration
├── services/
│   ├── token.service.ts # Token management
│   └── spotify.service.ts # Spotify API calls + transformers
├── types/
│   └── spotify.ts       # Type definitions for Spotify API responses
├── routes/
│   └── spotify.routes.ts # Route handlers
└── index.ts             # Main application
```

## License

MIT
