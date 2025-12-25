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
TOKEN_ENDPOINT=http://localhost:3000/spotifytoken 
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
> Most endpoints use the internal token from `TOKEN_ENDPOINT`. The `/playlist/full` endpoint requires `client_id` and `client_secret` credentials for direct Spotify Web API access (via query params or headers).

### Credentials

Credentials can be passed via:
- **Query parameters**: `?client_id=...&client_secret=...`
  or
- **Headers**: `X-Client-Id`, `X-Client-Secret`

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

**Response (example):**
```json
{
  "tracks": [
    {
      "album": {
        "album_type": "album",
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/28ile6AlnprjyeQzy4F0SB"
            },
            "href": "https://api.spotify.com/v1/artists/28ile6AlnprjyeQzy4F0SB",
            "id": "28ile6AlnprjyeQzy4F0SB",
            "name": "中野家の五つ子",
            "type": "artist",
            "uri": "spotify:artist:28ile6AlnprjyeQzy4F0SB"
          }
        ],
        "external_urls": {
          "spotify": "https://open.spotify.com/album/4y9VcDuLW4l7xkumHWL4n6"
        },
        "href": "https://api.spotify.com/v1/albums/4y9VcDuLW4l7xkumHWL4n6",
        "id": "4y9VcDuLW4l7xkumHWL4n6",
        "images": [
          {
            "url": "https://i.scdn.co/image/ab67616d00001e023920455e220ddcda838b6341",
            "width": 300,
            "height": 300
          },
          {
            "url": "https://i.scdn.co/image/ab67616d000048513920455e220ddcda838b6341",
            "width": 64,
            "height": 64
          },
          {
            "url": "https://i.scdn.co/image/ab67616d0000b2733920455e220ddcda838b6341",
            "width": 640,
            "height": 640
          }
        ],
        "name": "Gotobun no Katachi / Hatsukoi",
        "release_date": null,
        "release_date_precision": "day",
        "total_tracks": null,
        "type": "album",
        "uri": "spotify:album:4y9VcDuLW4l7xkumHWL4n6"
      },
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/28ile6AlnprjyeQzy4F0SB"
          },
          "href": "https://api.spotify.com/v1/artists/28ile6AlnprjyeQzy4F0SB",
          "id": "28ile6AlnprjyeQzy4F0SB",
          "name": "中野家の五つ子",
          "type": "artist",
          "uri": "spotify:artist:28ile6AlnprjyeQzy4F0SB"
        }
      ],
      "disc_number": 1,
      "duration_ms": 243733,
      "explicit": false,
      "external_urls": {
        "spotify": "https://open.spotify.com/track/6p9nMH9net8AjLCZJZtCLW"
      },
      "href": "https://api.spotify.com/v1/tracks/6p9nMH9net8AjLCZJZtCLW",
      "id": "6p9nMH9net8AjLCZJZtCLW",
      "is_local": false,
      "name": "Gotobun no Katachi",
      "popularity": null,
      "preview_url": null,
      "track_number": 1,
      "type": "track",
      "uri": "spotify:track:6p9nMH9net8AjLCZJZtCLW"
    }

    /* additional track objects *
  ]
}
```

### Playlist (Full Details)
Returns full Spotify Web API track details for all tracks in a playlist. Requires `client_id` and `client_secret`.

**By ID:**
```
GET /playlist/full/:id?client_id=...&client_secret=...
```

**By URL:**
```
GET /playlist/full?url=https://open.spotify.com/playlist/37i9dQZF1E35HoLL235RmS&client_id=...&client_secret=...
```

With headers:
```
GET /playlist/full/:id
Headers:
  X-Client-Id: your-client-id
  X-Client-Secret: your-client-secret
```

**Response (example):**
```json
{
  "tracks": [
    {
      "album": {
        "album_type": "single",
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/28ile6AlnprjyeQzy4F0SB"
            },
            "href": "https://api.spotify.com/v1/artists/28ile6AlnprjyeQzy4F0SB",
            "id": "28ile6AlnprjyeQzy4F0SB",
            "name": "中野家の五つ子",
            "type": "artist",
            "uri": "spotify:artist:28ile6AlnprjyeQzy4F0SB"
          }
        ],
        "available_markets": [...], //list of country codes
        "external_urls": {
          "spotify": "https://open.spotify.com/album/4Jx5LW1wbsc4PiPSSEkM6C"
        },
        "href": "https://api.spotify.com/v1/albums/4Jx5LW1wbsc4PiPSSEkM6C",
        "id": "4Jx5LW1wbsc4PiPSSEkM6C",
        "images": [
          {
            "url": "https://i.scdn.co/image/ab67616d0000b273b126381bd3ace23ca228b846",
            "width": 640,
            "height": 640
          },
          {
            "url": "https://i.scdn.co/image/ab67616d00001e02b126381bd3ace23ca228b846",
            "width": 300,
            "height": 300
          },
          {
            "url": "https://i.scdn.co/image/ab67616d00004851b126381bd3ace23ca228b846",
            "width": 64,
            "height": 64
          }
        ],
        "name": "Minamikaze, Summer Days",
        "release_date": "2021",
        "release_date_precision": "year",
        "total_tracks": 6,
        "type": "album",
        "uri": "spotify:album:4Jx5LW1wbsc4PiPSSEkM6C"
      },
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/28ile6AlnprjyeQzy4F0SB"
          },
          "href": "https://api.spotify.com/v1/artists/28ile6AlnprjyeQzy4F0SB",
          "id": "28ile6AlnprjyeQzy4F0SB",
          "name": "中野家の五つ子",
          "type": "artist",
          "uri": "spotify:artist:28ile6AlnprjyeQzy4F0SB"
        }
      ],
      "available_markets": [...], //list of country codes
      "disc_number": 1,
      "duration_ms": 227106,
      "explicit": false,
      "external_ids": {
        "isrc": "JPPC02002081"
      },
      "external_urls": {
        "spotify": "https://open.spotify.com/track/7zvRSERTwH7ovbYGoAk8wx"
      },
      "href": "https://api.spotify.com/v1/tracks/7zvRSERTwH7ovbYGoAk8wx",
      "id": "7zvRSERTwH7ovbYGoAk8wx",
      "is_local": false,
      "name": "Minamikaze",
      "popularity": 34,
      "preview_url": null,
      "track_number": 1,
      "type": "track",
      "uri": "spotify:track:7zvRSERTwH7ovbYGoAk8wx"
    }

    /* additional track objects */
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
GET /recommendations?url=https://open.spotify.com/track/7s2O8rpKRgPWhgqiHmmm4v
```

**Response (example):**
```json
{
  "seeds": [
    {
      "afterFilteringSize": 5,
      "afterRelinkingSize": 5,
      "href": "https://api.spotify.com/v1/tracks/7s2O8rpKRgPWhgqiHmmm4v",
      "id": "7s2O8rpKRgPWhgqiHmmm4v",
      "initialPoolSize": 5,
      "type": "track"
    }
  ],
  "tracks": [
    {
      "album": {
        "album_type": "album",
        "total_tracks": null,
        "available_markets": [],
        "external_urls": {
          "spotify": "https://open.spotify.com/album/4cm3TtYiebA1JHra2lMRnd"
        },
        "href": "https://api.spotify.com/v1/albums/4cm3TtYiebA1JHra2lMRnd",
        "id": "4cm3TtYiebA1JHra2lMRnd",
        "images": [
          {
            "url": "https://i.scdn.co/image/ab67616d00001e029cf9efa46a12fda63e0c8abe",
            "height": 300,
            "width": 300
          },
          {
            "url": "https://i.scdn.co/image/ab67616d000048519cf9efa46a12fda63e0c8abe",
            "height": 64,
            "width": 64
          },
          {
            "url": "https://i.scdn.co/image/ab67616d0000b2739cf9efa46a12fda63e0c8abe",
            "height": 640,
            "width": 640
          }
        ],
        "name": "",
        "release_date": null,
        "release_date_precision": "year",
        "type": "album",
        "uri": "spotify:album:4cm3TtYiebA1JHra2lMRnd",
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/4ES04xmx6ZGMYGyGIfGQgf"
            },
            "href": "https://api.spotify.com/v1/artists/4ES04xmx6ZGMYGyGIfGQgf",
            "id": "4ES04xmx6ZGMYGyGIfGQgf",
            "name": "佐々木恵梨",
            "type": "artist",
            "uri": "spotify:artist:4ES04xmx6ZGMYGyGIfGQgf"
          }
        ]
      },
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/4ES04xmx6ZGMYGyGIfGQgf"
          },
          "href": "https://api.spotify.com/v1/artists/4ES04xmx6ZGMYGyGIfGQgf",
          "id": "4ES04xmx6ZGMYGyGIfGQgf",
          "name": "佐々木恵梨",
          "type": "artist",
          "uri": "spotify:artist:4ES04xmx6ZGMYGyGIfGQgf"
        }
      ],
      "available_markets": [],
      "explicit": false,
      "external_ids": {

      },
      "external_urls": {
        "spotify": "https://open.spotify.com/track/2lPuTPwMUBRpNfNrA7sfuT"
      },
      "href": "https://api.spotify.com/v1/tracks/2lPuTPwMUBRpNfNrA7sfuT",
      "id": "2lPuTPwMUBRpNfNrA7sfuT",
      "is_playable": true,
      "name": "Ring of Fortune",
      "popularity": null,
      "preview_url": null,
      "type": "track",
      "uri": "spotify:track:2lPuTPwMUBRpNfNrA7sfuT",
      "is_local": false
    }

    /* additional track objects */
  ]
}
```

### Recommendations (Full Details)
Returns full Spotify Web API track details for recommendations derived from a seed track. Requires `client_id` and `client_secret` (same pattern as `/playlist/full`).

**By Track ID:**
```
GET /recommendations/full/:id?client_id=...&client_secret=...
```

**By Track URL:**
```
GET /recommendations/full?url=https://open.spotify.com/track/6TdiF8DD5f2qG5FXPtBtzb&client_id=...&client_secret=...
```

With headers:
```
GET /recommendations/full/:id
Headers:
  X-Client-Id: your-client-id
  X-Client-Secret: your-client-secret
```

**Response (example):**
```json
{
  "seeds": [
    {
      "afterFilteringSize": 5,
      "afterRelinkingSize": 5,
      "href": "https://api.spotify.com/v1/tracks/6TdiF8DD5f2qG5FXPtBtzb",
      "id": "6TdiF8DD5f2qG5FXPtBtzb",
      "initialPoolSize": 5,
      "type": "track"
    }
  ],
  "tracks": [
    {
      "album": {
        "album_type": "album",
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/4ES04xmx6ZGMYGyGIfGQgf"
            },
            "href": "https://api.spotify.com/v1/artists/4ES04xmx6ZGMYGyGIfGQgf",
            "id": "4ES04xmx6ZGMYGyGIfGQgf",
            "name": "佐々木恵梨",
            "type": "artist",
            "uri": "spotify:artist:4ES04xmx6ZGMYGyGIfGQgf"
          }
        ],
        "available_markets": [...], //list of country codes
        "external_urls": {
          "spotify": "https://open.spotify.com/album/4cm3TtYiebA1JHra2lMRnd"
        },
        "href": "https://api.spotify.com/v1/albums/4cm3TtYiebA1JHra2lMRnd",
        "id": "4cm3TtYiebA1JHra2lMRnd",
        "images": [
          {
            "url": "https://i.scdn.co/image/ab67616d0000b2739cf9efa46a12fda63e0c8abe",
            "width": 640,
            "height": 640
          },
          {
            "url": "https://i.scdn.co/image/ab67616d00001e029cf9efa46a12fda63e0c8abe",
            "width": 300,
            "height": 300
          },
          {
            "url": "https://i.scdn.co/image/ab67616d000048519cf9efa46a12fda63e0c8abe",
            "width": 64,
            "height": 64
          }
        ],
        "name": "Period",
        "release_date": "2017-08-23",
        "release_date_precision": "day",
        "total_tracks": 12,
        "type": "album",
        "uri": "spotify:album:4cm3TtYiebA1JHra2lMRnd"
      },
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/4ES04xmx6ZGMYGyGIfGQgf"
          },
          "href": "https://api.spotify.com/v1/artists/4ES04xmx6ZGMYGyGIfGQgf",
          "id": "4ES04xmx6ZGMYGyGIfGQgf",
          "name": "佐々木恵梨",
          "type": "artist",
          "uri": "spotify:artist:4ES04xmx6ZGMYGyGIfGQgf"
        }
      ],
      "available_markets": [...], //list of country codes
      "disc_number": 1,
      "duration_ms": 261399,
      "explicit": false,
      "external_ids": {
        "isrc": "JPK631501301"
      },
      "external_urls": {
        "spotify": "https://open.spotify.com/track/2lPuTPwMUBRpNfNrA7sfuT"
      },
      "href": "https://api.spotify.com/v1/tracks/2lPuTPwMUBRpNfNrA7sfuT",
      "id": "2lPuTPwMUBRpNfNrA7sfuT",
      "is_local": false,
      "name": "Ring of Fortune",
      "popularity": 46,
      "preview_url": null,
      "track_number": 1,
      "type": "track",
      "uri": "spotify:track:2lPuTPwMUBRpNfNrA7sfuT"
    }

    /* additional track objects */
  ]
}
```

Fields in each track follow the standard Spotify Web API `Track` object (album, artists, available_markets, external_ids, popularity, preview_url, etc.).

## Project Structure

```
src/
├── config/
│   └── env.ts              # Environment configuration
├── services/
│   ├── token.service.ts    # Token management
│   └── spotify.service.ts  # Spotify API calls
├── utils/
│   ├── extractors.ts       # ID extraction utilities (playlist & track)
│   └── transformers.ts     # Response transformation utilities
├── types/
│   └── spotify.ts          # Type definitions for Spotify API responses
├── routes/
│   └── spotify.routes.ts   # Route handlers
└── index.ts                # Main application
```

## License

This project is provided as-is for research and educational purposes only.

See [LICENSE](LICENSE)
