import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AnnictClient } from "../annict-client.ts";

export function registerUserTools(
	server: McpServer,
	client: AnnictClient,
): void {
	server.registerTool(
		"get_me",
		{
			description: "Annictの認証ユーザー情報を取得する",
			inputSchema: {},
		},
		async () => {
			const user = await client.getMe();

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(user, null, 2),
					},
				],
			};
		},
	);

	server.registerTool(
		"get_following_activities",
		{
			description:
				"フォロー中のユーザーのアニメ視聴アクティビティを取得する",
			inputSchema: {
				filter_actions: z
					.string()
					.optional()
					.describe("アクションで絞り込み（カンマ区切り。例: create_record,create_multiple_records,create_review）"),
				sort_id: z
					.enum(["asc", "desc"])
					.optional()
					.describe("IDでソート"),
				page: z.number().optional().describe("ページ番号"),
				per_page: z.number().optional().describe("1ページあたりの件数（デフォルト: 25, 最大: 50）"),
			},
		},
		async (args) => {
			const result = await client.getFollowingActivities(args);

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

	server.registerTool(
		"get_my_programs",
		{
			description:
				"自分のアニメ放送予定を取得する",
			inputSchema: {
				filter_started: z
					.boolean()
					.optional()
					.describe("放送開始済みのみ取得"),
				filter_unwatched: z
					.boolean()
					.optional()
					.describe("未視聴のみ取得"),
				sort_id: z
					.enum(["asc", "desc"])
					.optional()
					.describe("IDでソート"),
				sort_started_at: z
					.enum(["asc", "desc"])
					.optional()
					.describe("放送開始日時でソート"),
				page: z.number().optional().describe("ページ番号"),
				per_page: z.number().optional().describe("1ページあたりの件数（デフォルト: 25, 最大: 50）"),
			},
		},
		async (args) => {
			const result = await client.getMyPrograms(args);

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

	server.registerTool(
		"get_casts",
		{
			description:
				"アニメ作品のキャスト（声優）一覧を取得する。filter_work_id は必須",
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
			const result = await client.getCasts(args);

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

	server.registerTool(
		"get_staffs",
		{
			description:
				"アニメ作品のスタッフ一覧を取得する。filter_work_id は必須",
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
			const result = await client.getStaffs(args);

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
