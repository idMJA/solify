export interface SpotifyRequestVariables {
	uri: string;
	enableWatchFeedEntrypoint?: boolean;
	limit?: number;
}

export interface SpotifyAPIRequest<
	TVariables extends SpotifyRequestVariables = SpotifyRequestVariables,
> {
	variables: TVariables;
	operationName: string;
	extensions: {
		persistedQuery: {
			version: number;
			sha256Hash: string;
		};
	};
}

export interface SpotifyExternalUrl {
	spotify: string;
}

export interface SpotifyImage {
	url: string;
	width?: number | null;
	height?: number | null;
}

export interface SpotifyArtist {
	external_urls: SpotifyExternalUrl;
	href: string;
	id: string;
	name: string;
	type: "artist";
	uri: string;
}

export interface SpotifyAlbum {
	album_type: string;
	artists?: SpotifyArtist[];
	available_markets?: string[];
	external_urls: SpotifyExternalUrl;
	href: string;
	id: string;
	images: SpotifyImage[];
	name: string;
	release_date: string | null;
	release_date_precision: "day" | "month" | "year" | null;
	total_tracks: number | null;
	type: "album";
	uri: string;
}

export interface SpotifyTrack {
	album: SpotifyAlbum;
	artists: SpotifyArtist[];
	available_markets?: string[];
	disc_number?: number;
	duration_ms?: number;
	explicit: boolean;
	external_ids?: Record<string, unknown>;
	external_urls: SpotifyExternalUrl;
	href: string;
	id: string;
	is_local: boolean;
	is_playable?: boolean;
	name: string;
	popularity: number | null;
	preview_url: string | null;
	track_number?: number;
	type: "track";
	uri: string;
}

export interface PlaylistTracksResponse {
	tracks: SpotifyTrack[];
}

export interface RecommendationSeed {
	afterFilteringSize: number;
	afterRelinkingSize: number;
	href: string;
	id: string;
	initialPoolSize: number;
	type: "track";
}

export interface RecommendationsResponse {
	seeds: RecommendationSeed[];
	tracks: SpotifyTrack[];
}

export interface SpotifyPlaylistTrackItem {
	track?: SpotifyTrack | null;
}

export interface SpotifyWebPlaylistTracksResponse {
	items?: SpotifyPlaylistTrackItem[];
}

export interface PartnerImage {
	url?: string;
	width?: number;
	height?: number;
}

export interface PartnerProfile {
	name?: string;
}

export interface PartnerArtist {
	uri?: string;
	profile?: PartnerProfile;
}

export interface PartnerAlbum {
	uri?: string;
	coverArt?: {
		sources?: PartnerImage[];
	};
	name?: string;
}

export interface PartnerContentRating {
	label?: string;
}

export interface PartnerTrackDuration {
	totalMilliseconds?: number;
}

export interface PartnerPlayability {
	playable?: boolean;
}

export interface PartnerArtistCollection {
	items?: PartnerArtist[];
}

export interface PartnerTrackData {
	__typename?: string;
	albumOfTrack?: PartnerAlbum;
	artists?: PartnerArtistCollection;
	discNumber?: number;
	trackDuration?: PartnerTrackDuration;
	contentRating?: PartnerContentRating;
	uri?: string;
	name?: string;
	trackNumber?: number;
	playability?: PartnerPlayability;
}

export interface PartnerPlaylistItem {
	itemV2?: {
		data?: PartnerTrackData;
	};
}

export interface PartnerPlaylistResponse {
	data?: {
		playlistV2?: {
			content?: {
				items?: PartnerPlaylistItem[];
			};
		};
	};
}

export interface PartnerRecommendationItem {
	// some partner persisted queries return items wrapped as { content: { data: ... } }
	// while others return { data: ... } at the top level. Support both shapes.
	content?: {
		data?: PartnerTrackData;
	};
	data?: PartnerTrackData;
}

export interface PartnerRecommendationsResponse {
	data?: {
		internalLinkRecommenderTrack?: {
			items?: PartnerRecommendationItem[];
		};
		// some partner endpoints return recommendations under `seoRecommendedTrack`
		// (observed in partner responses). Support that shape as a fallback.
		seoRecommendedTrack?: {
			items?: PartnerRecommendationItem[];
		};
	};
}

export type PlaylistRequestVariables = {
	uri: string;
	enableWatchFeedEntrypoint: boolean;
};

export type RecommendationRequestVariables = {
	uri: string;
	limit: number;
};
