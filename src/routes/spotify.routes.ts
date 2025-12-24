import { Hono } from "hono";
import {
	fetchPlaylist,
	fetchPlaylistFull,
	fetchRecommendations,
} from "../services/spotify.service.js";

const router = new Hono();

function extractPlaylistId(input: string): string {
	if (input.includes("spotify.com/playlist/")) {
		const match = input.match(/playlist\/([a-zA-Z0-9]+)/);
		return match ? match[1] : input;
	}
	return input;
}

function extractTrackId(input: string): string {
	if (input.includes("spotify.com/track/")) {
		const match = input.match(/track\/([a-zA-Z0-9]+)/);
		return match ? match[1] : input;
	}
	return input;
}

// GET /playlist/:id or /playlist?url=<spotify-url>
router.get("/playlist/:id", async (c) => {
	try {
		const playlistId = extractPlaylistId(c.req.param("id"));
		const data = await fetchPlaylist(playlistId);
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
		const data = await fetchPlaylist(playlistId);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

// GET /playlist/full/:id?limit=50 or /playlist/full?url=<spotify-url>&limit=50
router.get("/playlist/full/:id", async (c) => {
	try {
		const userAuth = c.req.header("authorization")?.trim();
		if (!userAuth) {
			return c.json({ error: "Missing or invalid Authorization header" }, 401);
		}
		const playlistId = extractPlaylistId(c.req.param("id"));
		const parsedLimit = parseInt(c.req.query("limit") || "50", 10);
		const limit = Number.isNaN(parsedLimit)
			? 50
			: Math.max(1, Math.min(parsedLimit, 50));
		const data = await fetchPlaylistFull(playlistId, limit, userAuth);
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
		const userAuth = c.req.header("authorization")?.trim();
		if (!userAuth) {
			return c.json({ error: "Missing or invalid Authorization header" }, 401);
		}
		const url = c.req.query("url");
		if (!url) {
			return c.json({ error: "Missing url parameter" }, 400);
		}
		const playlistId = extractPlaylistId(url);
		const parsedLimit = parseInt(c.req.query("limit") || "50", 10);
		const limit = Number.isNaN(parsedLimit)
			? 50
			: Math.max(1, Math.min(parsedLimit, 50));
		const data = await fetchPlaylistFull(playlistId, limit, userAuth);
		return c.json(data);
	} catch (error) {
		return c.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			500,
		);
	}
});

// GET /recommendations/:id?limit=5 or /recommendations?url=<spotify-url>&limit=5
router.get("/recommendations/:id", async (c) => {
	try {
		const trackId = extractTrackId(c.req.param("id"));
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

export default router;
