import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";
import { AnnictClient } from "./annict-client.ts";

const mockFetch = mock.fn<typeof globalThis.fetch>();

const client = new AnnictClient({
	accessToken: "test-token",
});

beforeEach(() => {
	mockFetch.mock.resetCalls();
	mock.method(globalThis, "fetch", mockFetch);
});

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

describe("AnnictClient", () => {
	it("リクエストに access_token をクエリパラメータとして付与する", async () => {
		mockFetch.mock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ works: [], total_count: 0, next_page: null, prev_page: null })),
		);

		await client.searchWorks();

		const [url] = mockFetch.mock.calls[0].arguments;
		const parsed = new URL(url as string);
		assert.equal(parsed.searchParams.get("access_token"), "test-token");
	});

	it("ベース URL が正しく構築される", async () => {
		mockFetch.mock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ works: [], total_count: 0, next_page: null, prev_page: null })),
		);

		await client.searchWorks();

		const [url] = mockFetch.mock.calls[0].arguments;
		const parsed = new URL(url as string);
		assert.equal(parsed.origin, "https://api.annict.com");
		assert.equal(parsed.pathname, "/v1/works");
	});

	describe("searchWorks", () => {
		it("パラメータなしで作品検索する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ works: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.searchWorks();

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/works");
		});

		it("filter_title と per_page をクエリパラメータに含める", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ works: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.searchWorks({ filter_title: "ぼっち", per_page: 10 });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.searchParams.get("filter_title"), "ぼっち");
			assert.equal(parsed.searchParams.get("per_page"), "10");
		});
	});

	describe("getMyWorks", () => {
		it("GET /v1/me/works で自分の作品一覧を取得する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ works: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.getMyWorks({ filter_status: "watching" });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/me/works");
			assert.equal(parsed.searchParams.get("filter_status"), "watching");
		});
	});

	describe("getEpisodes", () => {
		it("GET /v1/episodes でエピソード一覧を取得する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ episodes: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.getEpisodes({ filter_work_id: 123 });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/episodes");
			assert.equal(parsed.searchParams.get("filter_work_id"), "123");
		});
	});

	describe("getRecords", () => {
		it("GET /v1/records で記録一覧を取得する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ records: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.getRecords({ filter_episode_id: 456 });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/records");
			assert.equal(parsed.searchParams.get("filter_episode_id"), "456");
		});
	});

	describe("getReviews", () => {
		it("GET /v1/reviews でレビュー一覧を取得する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ reviews: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.getReviews({ filter_work_id: 789 });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/reviews");
			assert.equal(parsed.searchParams.get("filter_work_id"), "789");
		});
	});

	describe("getMe", () => {
		it("GET /v1/me でユーザー情報を取得する", async () => {
			const user = { id: 1, username: "testuser", name: "Test" };
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse(user)),
			);

			const result = await client.getMe();

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/me");
			assert.equal(result.username, "testuser");
		});
	});

	describe("getFollowingActivities", () => {
		it("GET /v1/me/following_activities でアクティビティを取得する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ activities: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.getFollowingActivities({ filter_actions: "create_record" });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/me/following_activities");
			assert.equal(parsed.searchParams.get("filter_actions"), "create_record");
		});
	});

	describe("getMyPrograms", () => {
		it("GET /v1/me/programs で放送予定を取得する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ programs: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.getMyPrograms({ filter_unwatched: true });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/me/programs");
			assert.equal(parsed.searchParams.get("filter_unwatched"), "true");
		});
	});

	describe("getCasts", () => {
		it("GET /v1/casts でキャスト一覧を取得する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ casts: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.getCasts({ filter_work_id: 100 });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/casts");
			assert.equal(parsed.searchParams.get("filter_work_id"), "100");
		});
	});

	describe("getStaffs", () => {
		it("GET /v1/staffs でスタッフ一覧を取得する", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ staffs: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.getStaffs({ filter_work_id: 100 });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.pathname, "/v1/staffs");
			assert.equal(parsed.searchParams.get("filter_work_id"), "100");
		});
	});

	describe("undefined パラメータの除外", () => {
		it("undefined のパラメータはクエリに含めない", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ works: [], total_count: 0, next_page: null, prev_page: null })),
			);

			await client.searchWorks({ filter_title: "test", sort_id: undefined });

			const [url] = mockFetch.mock.calls[0].arguments;
			const parsed = new URL(url as string);
			assert.equal(parsed.searchParams.has("sort_id"), false);
			assert.equal(parsed.searchParams.get("filter_title"), "test");
		});
	});

	describe("エラーハンドリング", () => {
		it("API がエラーを返した場合に例外をスローする", async () => {
			mockFetch.mock.mockImplementationOnce(() =>
				Promise.resolve(new Response("Unauthorized", { status: 401 })),
			);

			await assert.rejects(() => client.getMe(), {
				message: /Annict API エラー \(401\): Unauthorized/,
			});
		});
	});
});
