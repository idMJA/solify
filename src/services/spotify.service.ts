import type {
	PartnerArtist,
	PartnerImage,
	PartnerPlaylistItem,
	PartnerPlaylistResponse,
	PartnerRecommendationItem,
	PartnerRecommendationsResponse,
	PlaylistRequestVariables,
	PlaylistTracksResponse,
	RecommendationRequestVariables,
	RecommendationsResponse,
	SpotifyAPIRequest,
	SpotifyArtist,
	SpotifyPlaylistTrackItem,
	SpotifyTrack,
	SpotifyWebPlaylistTracksResponse,
} from "../types/spotify.js";
import { getAccessToken } from "./token.service.js";

const SPOTIFY_API_BASE = "https://api-partner.spotify.com/pathfinder/v2/query";
const SPOTIFY_WEB_API_BASE = "https://api.spotify.com/v1";

function transformPlaylistResponse(
	data: PartnerPlaylistResponse,
): PlaylistTracksResponse {
	const playlistData = data?.data?.playlistV2;
	if (!playlistData?.content?.items) {
		return { tracks: [] };
	}

	const tracks = playlistData.content.items
		.map((item: PartnerPlaylistItem) => {
			const trackData = item.itemV2?.data;
			if (!trackData || trackData.__typename !== "Track") {
				return null;
			}

			const album = trackData.albumOfTrack;
			const artists: PartnerArtist[] = trackData.artists?.items ?? [];
			const albumId = album?.uri?.split(":")[2] ?? "";
			const trackId = trackData.uri?.split(":")[2] ?? "";

			const track: SpotifyTrack = {
				album: {
					album_type: "album",
					artists: artists.map(
						(artist): SpotifyArtist => ({
							external_urls: {
								spotify: `https://open.spotify.com/artist/${artist.uri?.split(":")[2]}`,
							},
							href: `https://api.spotify.com/v1/artists/${artist.uri?.split(":")[2]}`,
							id: artist.uri?.split(":")[2] ?? "",
							name: artist.profile?.name ?? "",
							type: "artist",
							uri: artist.uri ?? "",
						}),
					),
					external_urls: {
						spotify: `https://open.spotify.com/album/${albumId}`,
					},
					href: `https://api.spotify.com/v1/albums/${albumId}`,
					id: albumId,
					images:
						album?.coverArt?.sources?.map((source: PartnerImage) => ({
							url: source.url ?? "",
							width: source.width ?? null,
							height: source.height ?? null,
						})) || [],
					name: album?.name ?? "",
					release_date: null,
					release_date_precision: "day",
					total_tracks: null,
					type: "album",
					uri: album?.uri ?? "",
				},
				artists: artists.map(
					(artist): SpotifyArtist => ({
						external_urls: {
							spotify: `https://open.spotify.com/artist/${artist.uri?.split(":")[2]}`,
						},
						href: `https://api.spotify.com/v1/artists/${artist.uri?.split(":")[2]}`,
						id: artist.uri?.split(":")[2] ?? "",
						name: artist.profile?.name ?? "",
						type: "artist",
						uri: artist.uri ?? "",
					}),
				),
				disc_number: trackData.discNumber,
				duration_ms: trackData.trackDuration?.totalMilliseconds,
				explicit: trackData.contentRating?.label !== "NONE",
				external_urls: {
					spotify: `https://open.spotify.com/track/${trackId}`,
				},
				href: `https://api.spotify.com/v1/tracks/${trackId}`,
				id: trackId,
				is_local: false,
				name: trackData.name ?? "",
				popularity: null,
				preview_url: null,
				track_number: trackData.trackNumber,
				type: "track",
				uri: trackData.uri ?? "",
			};
			return track;
		})
		.filter((track: SpotifyTrack | null): track is SpotifyTrack =>
			Boolean(track),
		);

	return { tracks };
}

function transformRecommendationsResponse(
	data: PartnerRecommendationsResponse,
	seedTrackId: string,
): RecommendationsResponse {
	const recommendations = data?.data?.internalLinkRecommenderTrack?.items;
	if (!recommendations) {
		return { seeds: [], tracks: [] };
	}

	const tracks = recommendations
		.map((item: PartnerRecommendationItem) => {
			const trackData = item.content?.data;
			if (!trackData || trackData.__typename !== "Track") {
				return null;
			}

			const album = trackData.albumOfTrack;
			const artists: PartnerArtist[] = trackData.artists?.items ?? [];
			const albumId = album?.uri?.split(":")[2] ?? "";
			const trackId = trackData.uri?.split(":")[2] ?? "";

			const track: SpotifyTrack = {
				album: {
					album_type: "album",
					total_tracks: null,
					available_markets: [],
					external_urls: {
						spotify: `https://open.spotify.com/album/${albumId}`,
					},
					href: `https://api.spotify.com/v1/albums/${albumId}`,
					id: albumId,
					images:
						album?.coverArt?.sources?.map((source: PartnerImage) => ({
							url: source.url ?? "",
							height: source.height ?? null,
							width: source.width ?? null,
						})) || [],
					name: album?.name ?? "",
					release_date: null,
					release_date_precision: "year",
					type: "album",
					uri: album?.uri ?? "",
					artists: artists.map(
						(artist): SpotifyArtist => ({
							external_urls: {
								spotify: `https://open.spotify.com/artist/${artist.uri?.split(":")[2]}`,
							},
							href: `https://api.spotify.com/v1/artists/${artist.uri?.split(":")[2]}`,
							id: artist.uri?.split(":")[2] ?? "",
							name: artist.profile?.name ?? "",
							type: "artist",
							uri: artist.uri ?? "",
						}),
					),
				},
				artists: artists.map(
					(artist): SpotifyArtist => ({
						external_urls: {
							spotify: `https://open.spotify.com/artist/${artist.uri?.split(":")[2]}`,
						},
						href: `https://api.spotify.com/v1/artists/${artist.uri?.split(":")[2]}`,
						id: artist.uri?.split(":")[2] ?? "",
						name: artist.profile?.name ?? "",
						type: "artist",
						uri: artist.uri ?? "",
					}),
				),
				available_markets: [],
				disc_number: trackData.discNumber,
				duration_ms: trackData.trackDuration?.totalMilliseconds,
				explicit: trackData.contentRating?.label !== "NONE",
				external_ids: {},
				external_urls: {
					spotify: `https://open.spotify.com/track/${trackId}`,
				},
				href: `https://api.spotify.com/v1/tracks/${trackId}`,
				id: trackId,
				is_playable: trackData.playability?.playable || false,
				name: trackData.name ?? "",
				popularity: null,
				preview_url: null,
				track_number: trackData.trackNumber,
				type: "track",
				uri: trackData.uri ?? "",
				is_local: false,
			};
			return track;
		})
		.filter((track: SpotifyTrack | null): track is SpotifyTrack =>
			Boolean(track),
		);

	return {
		seeds: [
			{
				afterFilteringSize: tracks.length,
				afterRelinkingSize: tracks.length,
				href: `https://api.spotify.com/v1/tracks/${seedTrackId}`,
				id: seedTrackId,
				initialPoolSize: tracks.length,
				type: "track",
			},
		],
		tracks,
	};
}

export async function fetchPlaylist(playlistId: string, authToken?: string) {
	const token = authToken ?? (await getAccessToken());

	const payload: SpotifyAPIRequest<PlaylistRequestVariables> = {
		variables: {
			uri: `spotify:playlist:${playlistId}`,
			enableWatchFeedEntrypoint: false,
		},
		operationName: "fetchPlaylist",
		extensions: {
			persistedQuery: {
				version: 1,
				sha256Hash:
					"bb67e0af06e8d6f52b531f97468ee4acd44cd0f82b988e15c2ea47b1148efc77",
			},
		},
	};

	const response = await fetch(SPOTIFY_API_BASE, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(`Spotify API error: ${response.statusText}`);
	}

	const data = await response.json();
	return transformPlaylistResponse(data);
}

export async function fetchPlaylistFull(
	playlistId: string,
	limit: number = 50,
	authToken?: string,
): Promise<PlaylistTracksResponse> {
	const token = authToken ?? (await getAccessToken());
	const clampedLimit = Math.max(1, Math.min(limit, 50));

	const response = await fetch(
		`${SPOTIFY_WEB_API_BASE}/playlists/${playlistId}/tracks?limit=${clampedLimit}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		},
	);

	if (!response.ok) {
		throw new Error(`Spotify API error: ${response.statusText}`);
	}

	const data: SpotifyWebPlaylistTracksResponse = await response.json();
	const tracks = (data.items ?? [])
		.map((item: SpotifyPlaylistTrackItem) => item.track ?? null)
		.filter((track: SpotifyTrack | null): track is SpotifyTrack =>
			Boolean(track),
		);

	return { tracks };
}

export async function fetchRecommendations(
	trackId: string,
	limit: number = 5,
	authToken?: string,
) {
	const token = authToken ?? (await getAccessToken());

	const payload: SpotifyAPIRequest<RecommendationRequestVariables> = {
		variables: {
			uri: `spotify:track:${trackId}`,
			limit,
		},
		operationName: "internalLinkRecommenderTrack",
		extensions: {
			persistedQuery: {
				version: 1,
				sha256Hash:
					"c77098ee9d6ee8ad3eb844938722db60570d040b49f41f5ec6e7be9160a7c86b",
			},
		},
	};

	const response = await fetch(SPOTIFY_API_BASE, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(`Spotify API error: ${response.statusText}`);
	}

	const data = await response.json();
	return transformRecommendationsResponse(data, trackId);
}
