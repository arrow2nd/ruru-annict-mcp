import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AnnictClient } from "../annict-client.ts";

export function registerEpisodeTools(
	server: McpServer,
	client: AnnictClient,
): void {
	server.registerTool(
		"get_episodes",
		{
			description:
				"作品のエピソード一覧を取得する。filter_work_id は必須",
			inputSchema: {
				filter_work_id: z
					.number()
					.describe("作品ID（必須）"),
				sort_id: z
					.enum(["asc", "desc"])
					.optional()
					.describe("IDでソート"),
				sort_sort_number: z
					.enum(["asc", "desc"])
					.optional()
					.describe("ソート番号でソート"),
				page: z.number().optional().describe("ページ番号"),
				per_page: z.number().optional().describe("1ページあたりの件数（デフォルト: 25, 最大: 50）"),
			},
		},
		async (args) => {
			const result = await client.getEpisodes(args);

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		},
	);
}
