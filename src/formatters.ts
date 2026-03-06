import type {
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
} from "./annict-client.ts";

function lines(...parts: (string | undefined | false)[]): string {
	return parts.filter(Boolean).join("\n");
}

function paginationHeader(
	totalCount: number,
	nextPage: number | null,
	prevPage: number | null,
): string {
	const parts = [`${totalCount}件`];
	if (prevPage !== null || nextPage !== null) {
		const current = nextPage !== null ? nextPage - 1 : prevPage !== null ? prevPage + 1 : 1;
		parts.push(`ページ${current}`);
	}
	return parts.join(" | ");
}

function formatWork(w: Work): string {
	return lines(
		`## ${w.title} (ID: ${w.id})`,
		w.media_text && `- メディア: ${w.media_text}`,
		w.season_name_text && `- シーズン: ${w.season_name_text}`,
		`- エピソード数: ${w.episodes_count} / 視聴者数: ${w.watchers_count} / レビュー数: ${w.reviews_count}`,
		w.official_site_url && `- 公式サイト: ${w.official_site_url}`,
		w.wikipedia_url && `- Wikipedia: ${w.wikipedia_url}`,
	);
}

function formatEpisode(e: Episode): string {
	const title = e.title ? `「${e.title}」` : "";
	const num = e.number_text || "";
	return lines(
		`## ${num}${title} (ID: ${e.id})`,
		`- 記録数: ${e.records_count}`,
	);
}

function formatRecord(r: Record): string {
	const epText = r.episode.number_text || `EP${r.episode.id}`;
	return lines(
		`## ${r.user.name} - ${r.work.title} ${epText} (ID: ${r.id})`,
		r.rating_state && `- 評価: ${r.rating_state}`,
		r.comment && `- コメント: ${r.comment}`,
		`- いいね: ${r.likes_count} / 投稿日: ${r.created_at.split("T")[0]}`,
	);
}

function formatReview(r: Review): string {
	const ratings = [
		r.rating_animation_state && `映像 ${r.rating_animation_state}`,
		r.rating_music_state && `音楽 ${r.rating_music_state}`,
		r.rating_story_state && `ストーリー ${r.rating_story_state}`,
		r.rating_character_state && `キャラ ${r.rating_character_state}`,
		r.rating_overall_state && `総合 ${r.rating_overall_state}`,
	].filter(Boolean);

	return lines(
		`## ${r.title || "(無題)"} - ${r.work.title} (ID: ${r.id})`,
		`- 投稿者: ${r.user.name}`,
		ratings.length > 0 && `- 評価: ${ratings.join(" / ")}`,
		r.body && `- 本文: ${r.body}`,
		`- いいね: ${r.likes_count} / 投稿日: ${r.created_at.split("T")[0]}`,
	);
}

function formatUser(u: User): string {
	return lines(
		`# ${u.name} (@${u.username})`,
		`- 記録数: ${u.records_count}`,
		`- フォロー: ${u.followings_count} / フォロワー: ${u.followers_count}`,
		`- 視聴ステータス: 見たい ${u.wanna_watch_count} / 見てる ${u.watching_count} / 見た ${u.watched_count} / 一時中断 ${u.on_hold_count} / 視聴中止 ${u.stop_watching_count}`,
		u.url && `- URL: ${u.url}`,
	);
}

function formatActivity(a: Activity): string {
	const parts = [
		`## ${a.user.name} - ${a.action} (ID: ${a.id})`,
		a.work && `- 作品: ${a.work.title}`,
		`- 日時: ${a.created_at.split("T")[0]}`,
	];

	if (a.record) {
		a.record.rating_state && parts.push(`- 評価: ${a.record.rating_state}`);
		a.record.comment && parts.push(`- コメント: ${a.record.comment}`);
	}
	if (a.review) {
		a.review.body && parts.push(`- レビュー: ${a.review.body}`);
	}
	if (a.status) {
		parts.push(`- ステータス: ${a.status.kind}`);
	}

	return parts.filter(Boolean).join("\n");
}

function formatProgram(p: Program): string {
	const epText = p.episode.number_text || "";
	const epTitle = p.episode.title ? `「${p.episode.title}」` : "";
	return lines(
		`## ${p.work.title} - ${epText}${epTitle} (ID: ${p.id})`,
		`- チャンネル: ${p.channel.name}`,
		`- 放送開始: ${p.started_at}`,
		`- 再放送: ${p.is_rebroadcast ? "はい" : "いいえ"}`,
	);
}

function formatCast(c: Cast): string {
	return `## ${c.character.name} / ${c.name} (ID: ${c.id})`;
}

function formatStaff(s: Staff): string {
	const name = s.name || s.organization?.name || "";
	const role = s.role_text || s.role_other || "";
	return `## ${name} - ${role} (ID: ${s.id})`;
}

function formatPaginated<T>(
	result: PaginatedResponse<T>,
	key: keyof PaginatedResponse<T>,
	formatter: (item: T) => string,
): string {
	const header = paginationHeader(result.total_count, result.next_page, result.prev_page);
	const items = result[key] as T[] | undefined;
	if (!items || items.length === 0) {
		return `${header}\n\n(結果なし)`;
	}
	return `${header}\n\n${items.map(formatter).join("\n\n")}`;
}

export function formatWorks(result: PaginatedResponse<Work>): string {
	return formatPaginated(result, "works", formatWork);
}

export function formatEpisodes(result: PaginatedResponse<Episode>): string {
	return formatPaginated(result, "episodes", formatEpisode);
}

export function formatRecords(result: PaginatedResponse<Record>): string {
	return formatPaginated(result, "records", formatRecord);
}

export function formatReviews(result: PaginatedResponse<Review>): string {
	return formatPaginated(result, "reviews", formatReview);
}

export function formatActivities(result: PaginatedResponse<Activity>): string {
	return formatPaginated(result, "activities", formatActivity);
}

export function formatPrograms(result: PaginatedResponse<Program>): string {
	return formatPaginated(result, "programs", formatProgram);
}

export function formatCasts(result: PaginatedResponse<Cast>): string {
	return formatPaginated(result, "casts", formatCast);
}

export function formatStaffs(result: PaginatedResponse<Staff>): string {
	return formatPaginated(result, "staffs", formatStaff);
}

export { formatUser };
