import { Hono } from "hono";
import {
	fetchPlaylist,
	fetchPlaylistFull,
	fetchRecommendations,
	fetchRecommendationsFull,
} from "../services/spotify.service.js";
import { extractPlaylistId, extractTrackId } from "../utils/extractors.js";

const router = new Hono();

router.get("/playlist/full/:id", async (c) => {
	try {
		const raw = c.req.param("id");
		const playlistId = extractPlaylistId(raw);

		if (!/^[A-Za-z0-9_-]{8,}$/.test(playlistId)) {
			return c.json(
				{
					error: "Invalid playlist id",
					id: playlistId,
					raw: c.req.param("id"),
				},
				400,
			);
		}

		let clientId =
			c.req.query("client_id") ||
			c.req.header("x-client-id") ||
			c.req.header("x-spotify-client-id");
		let clientSecret =
			c.req.query("client_secret") ||
			c.req.header("x-client-secret") ||
			c.req.header("x-spotify-client-secret");

		if (raw.includes("&")) {
			const paramStr = raw.split("&").slice(1).join("&");
			try {
				const params = new URLSearchParams(paramStr);
				clientId = clientId || params.get("client_id") || undefined;
				clientSecret = clientSecret || params.get("client_secret") || undefined;
			} catch {
				// ignore parse errors
			}
		}

		if (!clientId || !clientSecret) {
			return c.json(
				{ error: "client_id and client_secret are required in the request" },
				400,
			);
		}

		const limit = parseInt(c.req.query("limit") || "0", 10);
		const data = await fetchPlaylistFull(
			playlistId,
			clientId,
			clientSecret,
			limit > 0 ? limit : undefined,
		);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

router.get("/playlist/full", async (c) => {
	try {
		const url = c.req.query("url");
		if (!url) {
			return c.json({ error: "Missing url parameter" }, 400);
		}
		const playlistId = extractPlaylistId(url);
		if (!/^[A-Za-z0-9_-]{8,}$/.test(playlistId)) {
			return c.json(
				{
					error: "Unable to parse playlist id from url",
					id: playlistId,
					raw: url,
				},
				400,
			);
		}

		const clientId = c.req.query("client_id") || c.req.header("x-client-id");
		const clientSecret =
			c.req.query("client_secret") || c.req.header("x-client-secret");

		if (!clientId || !clientSecret) {
			return c.json(
				{ error: "client_id and client_secret are required in the request" },
				400,
			);
		}

		const limit = parseInt(c.req.query("limit") || "0", 10);
		const data = await fetchPlaylistFull(
			playlistId,
			clientId,
			clientSecret,
			limit > 0 ? limit : undefined,
		);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

router.get("/playlist", async (c) => {
	try {
		const url = c.req.query("url");
		if (!url) {
			return c.json({ error: "Missing url parameter" }, 400);
		}
		const playlistId = extractPlaylistId(url);
		if (!/^[A-Za-z0-9_-]{8,}$/.test(playlistId)) {
			console.debug("/playlist/full (query) - unable to parse playlist id", {
				url,
				parsed: playlistId,
			});
			return c.json(
				{
					error: "Unable to parse playlist id from url",
					id: playlistId,
					raw: url,
				},
				400,
			);
		}
		const limit = parseInt(c.req.query("limit") || "0", 10);
		const data = await fetchPlaylist(
			playlistId,
			undefined,
			limit > 0 ? { limit } : undefined,
		);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

router.get("/playlist/:id", async (c) => {
	try {
		const raw = c.req.param("id");
		const playlistId = extractPlaylistId(raw);

		if (!/^[A-Za-z0-9_-]{8,}$/.test(playlistId)) {
			console.debug("/playlist (path) - unable to parse playlist id", {
				raw,
				parsed: playlistId,
			});
			return c.json(
				{
					error: "Unable to parse playlist id from path",
					id: playlistId,
					raw,
				},
				400,
			);
		}

		const limit = parseInt(c.req.query("limit") || "0", 10);
		const data = await fetchPlaylist(
			playlistId,
			undefined,
			limit > 0 ? { limit } : undefined,
		);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

router.get("/recommendations/:id", async (c) => {
	try {
		const url = c.req.param("id");
		const trackId = extractTrackId(url);

		if (!/^[A-Za-z0-9_-]{8,}$/.test(trackId)) {
			return c.json(
				{
					error:
						"Invalid track id — ensure you pass the id (or use ?limit=..) as a query param",
					id: trackId,
					url,
				},
				400,
			);
		}
		const limit = parseInt(c.req.query("limit") || "5", 10);
		const data = await fetchRecommendations(trackId, limit);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

router.get("/recommendations", async (c) => {
	try {
		const url = c.req.query("url");
		if (!url) {
			return c.json({ error: "Missing url parameter" }, 400);
		}
		const trackId = extractTrackId(url);
		const limit = parseInt(c.req.query("limit") || "5", 10);
		const data = await fetchRecommendations(trackId, limit);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

router.get("/recommendations/full/:id", async (c) => {
	try {
		const raw = c.req.param("id");
		const trackId = extractTrackId(raw);

		if (!/^[A-Za-z0-9_-]{8,}$/.test(trackId)) {
			return c.json(
				{
					error: "Invalid track id",
					id: trackId,
					raw,
				},
				400,
			);
		}

		const clientId = c.req.query("client_id") || c.req.header("x-client-id");
		const clientSecret =
			c.req.query("client_secret") || c.req.header("x-client-secret");

		if (!clientId || !clientSecret) {
			return c.json(
				{ error: "client_id and client_secret are required in the request" },
				400,
			);
		}

		const limit = parseInt(c.req.query("limit") || "5", 10);
		const data = await fetchRecommendationsFull(
			trackId,
			limit,
			clientId,
			clientSecret,
		);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

router.get("/recommendations/full", async (c) => {
	try {
		const url = c.req.query("url");
		if (!url) {
			return c.json({ error: "Missing url parameter" }, 400);
		}
		const trackId = extractTrackId(url);
		if (!/^[A-Za-z0-9_-]{8,}$/.test(trackId)) {
			return c.json(
				{
					error: "Unable to parse track id from url",
					id: trackId,
					raw: url,
				},
				400,
			);
		}

		const clientId = c.req.query("client_id") || c.req.header("x-client-id");
		const clientSecret =
			c.req.query("client_secret") || c.req.header("x-client-secret");

		if (!clientId || !clientSecret) {
			return c.json(
				{ error: "client_id and client_secret are required in the request" },
				400,
			);
		}

		const limit = parseInt(c.req.query("limit") || "5", 10);
		const data = await fetchRecommendationsFull(
			trackId,
			limit,
			clientId,
			clientSecret,
		);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

export default router;
