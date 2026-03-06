import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AnnictClient } from "../annict-client.ts";

export function registerRecordTools(
	server: McpServer,
	client: AnnictClient,
): void {
	server.registerTool(
		"get_records",
		{
			description:
				"アニメのエピソードへの記録（感想・評価）一覧を取得する",
			inputSchema: {
				filter_episode_id: z
					.number()
					.optional()
					.describe("エピソードIDで絞り込み"),
				filter_has_record_comment: z
					.boolean()
					.optional()
					.describe("コメント付きの記録のみ取得"),
				sort_id: z
					.enum(["asc", "desc"])
					.optional()
					.describe("IDでソート"),
				sort_likes_count: z
					.enum(["asc", "desc"])
					.optional()
					.describe("いいね数でソート"),
				page: z.number().optional().describe("ページ番号"),
				per_page: z.number().optional().describe("1ページあたりの件数（デフォルト: 25, 最大: 50）"),
			},
		},
		async (args) => {
			const result = await client.getRecords(args);

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
