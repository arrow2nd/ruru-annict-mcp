import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AnnictClient } from "../annict-client.ts";
import { formatWorks } from "../formatters.ts";

export function registerWorkTools(
	server: McpServer,
	client: AnnictClient,
): void {
	server.registerTool(
		"search_works",
		{
			description:
				"Annict（アニメ視聴管理サービス）でアニメ作品を検索する。タイトル・シーズン等で絞り込み可能",
			inputSchema: {
				filter_title: z
					.string()
					.optional()
					.describe("タイトルで絞り込み"),
				filter_season: z
					.string()
					.optional()
					.describe("リリース時期で絞り込み（例: 2024-winter, 2024-spring, 2024-summer, 2024-autumn）"),
				filter_ids: z
					.string()
					.optional()
					.describe("作品IDをカンマ区切りで指定して絞り込み（例: 1,2,3）"),
				sort_id: z
					.enum(["asc", "desc"])
					.optional()
					.describe("IDでソート"),
				sort_season: z
					.enum(["asc", "desc"])
					.optional()
					.describe("シーズンでソート"),
				sort_watchers_count: z
					.enum(["asc", "desc"])
					.optional()
					.describe("視聴者数でソート"),
				page: z.number().optional().describe("ページ番号"),
				per_page: z.number().optional().describe("1ページあたりの件数（デフォルト: 25, 最大: 50）"),
			},
		},
		async (args) => {
			const result = await client.searchWorks(args);

			return {
				content: [
					{
						type: "text" as const,
						text: formatWorks(result),
					},
				],
			};
		},
	);

	server.registerTool(
		"get_my_works",
		{
			description:
				"自分がステータスを付けたアニメ作品の一覧を取得する",
			inputSchema: {
				filter_status: z
					.enum(["wanna_watch", "watching", "watched", "on_hold", "stop_watching"])
					.optional()
					.describe("視聴ステータスで絞り込み"),
				sort_id: z
					.enum(["asc", "desc"])
					.optional()
					.describe("IDでソート"),
				sort_season: z
					.enum(["asc", "desc"])
					.optional()
					.describe("シーズンでソート"),
				page: z.number().optional().describe("ページ番号"),
				per_page: z.number().optional().describe("1ページあたりの件数（デフォルト: 25, 最大: 50）"),
			},
		},
		async (args) => {
			const result = await client.getMyWorks(args);

			return {
				content: [
					{
						type: "text" as const,
						text: formatWorks(result),
					},
				],
			};
		},
	);
}
