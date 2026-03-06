import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AnnictClient } from "../annict-client.ts";
import { formatReviews } from "../formatters.ts";

export function registerReviewTools(
	server: McpServer,
	client: AnnictClient,
): void {
	server.registerTool(
		"get_reviews",
		{
			description:
				"アニメ作品のレビュー一覧を取得する",
			inputSchema: {
				filter_work_id: z
					.number()
					.optional()
					.describe("作品IDで絞り込み"),
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
			const result = await client.getReviews(args);

			return {
				content: [
					{
						type: "text" as const,
						text: formatReviews(result),
					},
				],
			};
		},
	);
}
