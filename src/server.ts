import "dotenv/config";
import { fileURLToPath } from "node:url";
import { config } from "./config/env.js";
import { app } from "./index.js";

export function startServer() {
	try {
		console.log(`Starting server on ${config.host}:${config.port} (Bun)`);
		Bun.serve({
			fetch: app.fetch as unknown as (req: Request) => Promise<Response>,
			port: config.port,
			hostname: config.host,
		});
	} catch (err) {
		console.error("Failed to start Bun server:", err);
		process.exit(1);
	}
}

if (process.argv && process.argv[1] === fileURLToPath(import.meta.url)) {
	startServer();
}

export default startServer;
