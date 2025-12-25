import type {
	PartnerArtist,
	PartnerImage,
	PartnerPlaylistItem,
	PartnerPlaylistResponse,
	PartnerRecommendationItem,
	PartnerRecommendationsResponse,
	PlaylistTracksResponse,
	RecommendationsResponse,
	SpotifyArtist,
	SpotifyTrack,
} from "../types/spotify.js";

export function transformPlaylistResponse(
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

export function transformRecommendationsResponse(
	data: PartnerRecommendationsResponse,
	seedTrackId: string,
): RecommendationsResponse {
	// shits api may return recommendations under different fields depending on
	// the persisted query. prefer `internalLinkRecommenderTrack`, but fall back
	// to `seoRecommendedTrack` when available (observed in partner responses)
	const recommendations =
		data?.data?.internalLinkRecommenderTrack?.items ??
		data?.data?.seoRecommendedTrack?.items;
	if (!recommendations) {
		return { seeds: [], tracks: [] };
	}

	const tracks = recommendations
		.map((item: PartnerRecommendationItem) => {
			// Support both { content: { data } } and { data } item shapes returned
			// by different partner persisted queries.
			const trackData = item.content?.data ?? item.data;
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
