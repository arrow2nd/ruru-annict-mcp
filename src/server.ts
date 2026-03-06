import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AnnictClient } from "./annict-client.ts";
import { registerEpisodeTools } from "./tools/episodes.ts";
import { registerRecordTools } from "./tools/records.ts";
import { registerReviewTools } from "./tools/reviews.ts";
import { registerUserTools } from "./tools/user.ts";
import { registerWorkTools } from "./tools/works.ts";

export function createMcpServer(client: AnnictClient): McpServer {
	const server = new McpServer({
		name: "ruru-annict-mcp",
		version: "0.1.0",
	});

	registerWorkTools(server, client);
	registerEpisodeTools(server, client);
	registerRecordTools(server, client);
	registerReviewTools(server, client);
	registerUserTools(server, client);

	return server;
}
