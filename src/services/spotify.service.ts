import type {
	PlaylistRequestVariables,
	RecommendationRequestVariables,
	SpotifyAPIRequest,
	SpotifyPlaylist,
	SpotifyPlaylistTrackItem,
	SpotifyTrack,
} from "../types/spotify.js";
import {
	transformPlaylistResponse,
	transformRecommendationsResponse,
} from "../utils/transformers.js";
import { getAccessToken, getWebApiToken } from "./token.service.js";

const SPOTIFY_API_BASE = "https://api-partner.spotify.com/pathfinder/v2/query";
const SPOTIFY_WEB_API_BASE = "https://api.spotify.com/v1";

export async function fetchPlaylist(
	playlistId: string,
	authToken?: string,
): Promise<SpotifyPlaylist> {
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
	// returns a SpotifyPlaylist object (Spotify Web API-like)
	return transformPlaylistResponse(data) as SpotifyPlaylist;
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

export async function fetchPlaylistFull(
	playlistId: string,
	clientId?: string,
	clientSecret?: string,
) {
	const playlist = (await fetchPlaylist(playlistId)) as SpotifyPlaylist;

	const items: SpotifyPlaylistTrackItem[] = playlist.tracks?.items ?? [];
	const ids = items
		.map((it) => it.track?.id)
		.filter((x): x is string => Boolean(x));

	if (!ids.length) {
		return playlist;
	}

	const token = await getWebApiToken(clientId, clientSecret);

	const batches: string[][] = [];
	for (let i = 0; i < ids.length; i += 50) {
		batches.push(ids.slice(i, i + 50));
	}

	// fetch batches concurrently (web api supports up to 50 ids per
	// request). just run all batch requests in parallel and aggregate results
	const aggregatedTracks: SpotifyTrack[] = [];

	const fetchPromises = batches.map((batch) => {
		const url = `${SPOTIFY_WEB_API_BASE}/tracks?ids=${encodeURIComponent(batch.join(","))}`;
		return fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	});

	const responses = await Promise.all(fetchPromises);

	for (const response of responses) {
		if (!response.ok) {
			const text = await response.text();
			throw new Error(
				`Spotify Web API error: ${response.status} ${response.statusText} - ${text}`,
			);
		}
		const data = await response.json();
		if (Array.isArray(data.tracks)) {
			aggregatedTracks.push(...(data.tracks as SpotifyTrack[]));
		}
	}

	const idMap = new Map(aggregatedTracks.map((t) => [t.id, t]));
	const mergedItems = items.map((it) => {
		const id = it.track?.id;
		if (id && idMap.has(id)) {
			return { ...it, track: idMap.get(id) };
		}
		return it;
	});

	playlist.tracks.items = mergedItems;
	playlist.tracks.total = mergedItems.length;
	return playlist;
}

export async function fetchRecommendationsFull(
	trackId: string,
	limit: number = 5,
	clientId?: string,
	clientSecret?: string,
) {
	const rec = await fetchRecommendations(trackId, limit);
	const ids = rec.tracks.map((t) => t.id).filter(Boolean);

	if (!ids.length) {
		// return the original seeds and empty tracks array
		return { seeds: rec.seeds, tracks: [] };
	}

	const token = await getWebApiToken(clientId, clientSecret);

	const batches: string[][] = [];
	for (let i = 0; i < ids.length; i += 50) {
		batches.push(ids.slice(i, i + 50));
	}

	const fetchPromises = batches.map((batch) => {
		const url = `${SPOTIFY_WEB_API_BASE}/tracks?ids=${encodeURIComponent(batch.join(","))}`;
		return fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	});

	const responses = await Promise.all(fetchPromises);
	const aggregatedTracks: SpotifyTrack[] = [];

	for (const response of responses) {
		if (!response.ok) {
			const text = await response.text();
			throw new Error(
				`Spotify Web API error: ${response.status} ${response.statusText} - ${text}`,
			);
		}
		const data = await response.json();
		if (Array.isArray(data.tracks)) {
			aggregatedTracks.push(...(data.tracks as SpotifyTrack[]));
		}
	}

	return { seeds: rec.seeds, tracks: aggregatedTracks };
}
