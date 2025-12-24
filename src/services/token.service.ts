import { config } from "../config/env.js";

interface TokenResponse {
	clientId: string;
	accessToken: string;
	accessTokenExpirationTimestampMs: number;
	isAnonymous: boolean;
}

let cachedToken: string | null = null;
let tokenExpiration: number = 0;

export async function getAccessToken(): Promise<string> {
	if (cachedToken && Date.now() < tokenExpiration - 300000) {
		return cachedToken;
	}

	try {
		const response = await fetch(config.tokenEndpoint);

		if (!response.ok) {
			throw new Error(`Failed to fetch token: ${response.statusText}`);
		}

		const data: TokenResponse = await response.json();

		cachedToken = data.accessToken;
		tokenExpiration = data.accessTokenExpirationTimestampMs;

		return data.accessToken;
	} catch (error) {
		throw new Error(`Error fetching Spotify token: ${error}`);
	}
}
