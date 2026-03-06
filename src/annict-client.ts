type AnnictClientConfig = {
	accessToken: string;
};

type PaginatedResponse<T> = {
	works?: T[];
	episodes?: T[];
	records?: T[];
	reviews?: T[];
	activities?: T[];
	programs?: T[];
	casts?: T[];
	staffs?: T[];
	total_count: number;
	next_page: number | null;
	prev_page: number | null;
};

type Work = {
	id: number;
	title: string;
	title_kana: string;
	media: string;
	media_text: string;
	season_name: string;
	season_name_text: string;
	released_on: string;
	released_on_about: string;
	official_site_url: string;
	wikipedia_url: string;
	twitter_username: string;
	twitter_hashtag: string;
	syobocal_tid: string;
	mal_anime_id: string;
	images: {
		recommended_url: string;
		facebook: { og_image_url: string };
		twitter: { mini_avatar_url: string; normal_avatar_url: string; bigger_avatar_url: string; original_avatar_url: string; image_url: string };
	};
	episodes_count: number;
	watchers_count: number;
	reviews_count: number;
	no_episodes: boolean;
};

type Episode = {
	id: number;
	number: number | null;
	number_text: string;
	sort_number: number;
	title: string;
	records_count: number;
	record_comments_count: number;
	work: Work;
	prev_episode: { id: number; number: number | null; number_text: string; title: string } | null;
	next_episode: { id: number; number: number | null; number_text: string; title: string } | null;
};

type Record = {
	id: number;
	comment: string;
	rating: number | null;
	rating_state: string | null;
	is_modified: boolean;
	likes_count: number;
	comments_count: number;
	created_at: string;
	user: User;
	work: Work;
	episode: { id: number; number: number | null; number_text: string; title: string };
};

type Review = {
	id: number;
	title: string;
	body: string;
	rating_animation_state: string | null;
	rating_music_state: string | null;
	rating_story_state: string | null;
	rating_character_state: string | null;
	rating_overall_state: string | null;
	likes_count: number;
	impressions_count: number;
	created_at: string;
	modified_at: string | null;
	user: User;
	work: Work;
};

type User = {
	id: number;
	username: string;
	name: string;
	description: string;
	url: string;
	avatar_url: string;
	background_image_url: string;
	records_count: number;
	followings_count: number;
	followers_count: number;
	wanna_watch_count: number;
	watching_count: number;
	watched_count: number;
	on_hold_count: number;
	stop_watching_count: number;
	created_at: string;
};

type Activity = {
	id: number;
	user: User;
	action: string;
	created_at: string;
	work?: Work;
	episode?: { id: number; number: number | null; number_text: string; title: string };
	record?: Record;
	review?: Review;
	status?: { kind: string };
};

type Program = {
	id: number;
	started_at: string;
	is_rebroadcast: boolean;
	channel: { id: number; name: string };
	work: Work;
	episode: { id: number; number: number | null; number_text: string; title: string };
};

type Cast = {
	id: number;
	name: string;
	name_en: string;
	sort_number: number;
	work: Work;
	character: { id: number; name: string; name_en: string };
	person: { id: number; name: string; name_en: string };
};

type Staff = {
	id: number;
	name: string;
	name_en: string;
	role_text: string;
	role_other: string;
	role_other_en: string;
	sort_number: number;
	work: Work;
	organization: { id: number; name: string; name_en: string } | null;
	person: { id: number; name: string; name_en: string } | null;
};

type PaginationParams = {
	page?: number;
	per_page?: number;
};

type SearchWorksParams = PaginationParams & {
	filter_title?: string;
	filter_season?: string;
	filter_ids?: string;
	sort_id?: "asc" | "desc";
	sort_season?: "asc" | "desc";
	sort_watchers_count?: "asc" | "desc";
};

type GetMyWorksParams = PaginationParams & {
	filter_status?: "wanna_watch" | "watching" | "watched" | "on_hold" | "stop_watching";
	sort_id?: "asc" | "desc";
	sort_season?: "asc" | "desc";
};

type GetEpisodesParams = PaginationParams & {
	filter_work_id: number;
	sort_id?: "asc" | "desc";
	sort_sort_number?: "asc" | "desc";
};

type GetRecordsParams = PaginationParams & {
	filter_episode_id?: number;
	filter_has_record_comment?: boolean;
	sort_id?: "asc" | "desc";
	sort_likes_count?: "asc" | "desc";
};

type GetReviewsParams = PaginationParams & {
	filter_work_id?: number;
	sort_id?: "asc" | "desc";
	sort_likes_count?: "asc" | "desc";
};

type GetFollowingActivitiesParams = PaginationParams & {
	filter_actions?: string;
	sort_id?: "asc" | "desc";
};

type GetMyProgramsParams = PaginationParams & {
	filter_started?: boolean;
	filter_unwatched?: boolean;
	sort_id?: "asc" | "desc";
	sort_started_at?: "asc" | "desc";
};

type GetCastsParams = PaginationParams & {
	filter_work_id: number;
	sort_id?: "asc" | "desc";
	sort_sort_number?: "asc" | "desc";
};

type GetStaffsParams = PaginationParams & {
	filter_work_id: number;
	sort_id?: "asc" | "desc";
	sort_sort_number?: "asc" | "desc";
};

export type {
	AnnictClientConfig,
	PaginatedResponse,
	Work,
	Episode,
	Record,
	Review,
	User,
	Activity,
	Program,
	Cast,
	Staff,
	SearchWorksParams,
	GetMyWorksParams,
	GetEpisodesParams,
	GetRecordsParams,
	GetReviewsParams,
	GetFollowingActivitiesParams,
	GetMyProgramsParams,
	GetCastsParams,
	GetStaffsParams,
};

export class AnnictClient {
	private readonly accessToken: string;
	private readonly baseUrl = "https://api.annict.com";

	constructor(config: AnnictClientConfig) {
		this.accessToken = config.accessToken;
	}

	private buildUrl(path: string, params?: object): string {
		const url = new URL(`${this.baseUrl}${path}`);

		if (params) {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					url.searchParams.set(key, String(value));
				}
			}
		}

		url.searchParams.set("access_token", this.accessToken);
		return url.toString();
	}

	private async request<T>(path: string, params?: object): Promise<T> {
		const url = this.buildUrl(path, params);
		const res = await fetch(url);

		if (!res.ok) {
			const body = await res.text();
			throw new Error(`Annict API エラー (${res.status}): ${body}`);
		}

		return res.json() as Promise<T>;
	}

	async searchWorks(params?: SearchWorksParams): Promise<PaginatedResponse<Work>> {
		return this.request<PaginatedResponse<Work>>("/v1/works", params);
	}

	async getMyWorks(params?: GetMyWorksParams): Promise<PaginatedResponse<Work>> {
		return this.request<PaginatedResponse<Work>>("/v1/me/works", params);
	}

	async getEpisodes(params: GetEpisodesParams): Promise<PaginatedResponse<Episode>> {
		return this.request<PaginatedResponse<Episode>>("/v1/episodes", params);
	}

	async getRecords(params?: GetRecordsParams): Promise<PaginatedResponse<Record>> {
		return this.request<PaginatedResponse<Record>>("/v1/records", params);
	}

	async getReviews(params?: GetReviewsParams): Promise<PaginatedResponse<Review>> {
		return this.request<PaginatedResponse<Review>>("/v1/reviews", params);
	}

	async getMe(): Promise<User> {
		return this.request<User>("/v1/me");
	}

	async getFollowingActivities(params?: GetFollowingActivitiesParams): Promise<PaginatedResponse<Activity>> {
		return this.request<PaginatedResponse<Activity>>("/v1/me/following_activities", params);
	}

	async getMyPrograms(params?: GetMyProgramsParams): Promise<PaginatedResponse<Program>> {
		return this.request<PaginatedResponse<Program>>("/v1/me/programs", params);
	}

	async getCasts(params: GetCastsParams): Promise<PaginatedResponse<Cast>> {
		return this.request<PaginatedResponse<Cast>>("/v1/casts", params);
	}

	async getStaffs(params: GetStaffsParams): Promise<PaginatedResponse<Staff>> {
		return this.request<PaginatedResponse<Staff>>("/v1/staffs", params);
	}
}
