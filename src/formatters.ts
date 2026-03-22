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

function yamlStr(value: string): string {
	if (value === "") {
		return '""';
	}
	const escaped = value
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/\n/g, "\\n");
	return `"${escaped}"`;
}

function field(
	key: string,
	value: string | number | boolean | null | undefined,
): string | false {
	if (value === null || value === undefined || value === "") {
		return false;
	}
	if (typeof value === "string") {
		return `${key}: ${yamlStr(value)}`;
	}
	return `${key}: ${value}`;
}

function lines(...parts: (string | undefined | false)[]): string {
	return parts.filter(Boolean).join("\n");
}

function indent(text: string, level = 1): string {
	const prefix = "  ".repeat(level);
	return text
		.split("\n")
		.map((line) => `${prefix}${line}`)
		.join("\n");
}

function listItem(text: string): string {
	const itemLines = text.split("\n");
	if (itemLines.length === 1) {
		return `  - ${itemLines[0]}`;
	}
	return `  - ${itemLines[0]}\n${itemLines
		.slice(1)
		.map((l) => `    ${l}`)
		.join("\n")}`;
}

function formatWork(w: Work): string {
	return lines(
		field("id", w.id),
		field("title", w.title),
		field("media", w.media_text),
		field("season", w.season_name_text),
		field("episodes_count", w.episodes_count),
		field("watchers_count", w.watchers_count),
		field("reviews_count", w.reviews_count),
		field("official_site_url", w.official_site_url),
		field("wikipedia_url", w.wikipedia_url),
	);
}

function formatEpisode(e: Episode): string {
	return lines(
		field("id", e.id),
		field("number", e.number_text),
		field("title", e.title),
		field("records_count", e.records_count),
	);
}

function formatRecord(r: Record): string {
	return lines(
		field("id", r.id),
		field("user", r.user.name),
		field("work", r.work.title),
		field("episode", r.episode.number_text || `EP${r.episode.id}`),
		field("rating", r.rating_state),
		field("comment", r.comment),
		field("likes_count", r.likes_count),
		field("created_at", r.created_at.split("T")[0]),
	);
}

function formatReview(r: Review): string {
	const ratingEntries = lines(
		field("animation", r.rating_animation_state),
		field("music", r.rating_music_state),
		field("story", r.rating_story_state),
		field("character", r.rating_character_state),
		field("overall", r.rating_overall_state),
	);

	return lines(
		field("id", r.id),
		field("title", r.title || "(無題)"),
		field("work", r.work.title),
		field("user", r.user.name),
		ratingEntries && `ratings:\n${indent(ratingEntries)}`,
		field("body", r.body),
		field("likes_count", r.likes_count),
		field("created_at", r.created_at.split("T")[0]),
	);
}

function formatUser(u: User): string {
	return lines(
		field("id", u.id),
		field("name", u.name),
		field("username", u.username),
		field("records_count", u.records_count),
		field("followings_count", u.followings_count),
		field("followers_count", u.followers_count),
		`status:\n${indent(
			lines(
				field("wanna_watch", u.wanna_watch_count),
				field("watching", u.watching_count),
				field("watched", u.watched_count),
				field("on_hold", u.on_hold_count),
				field("stop_watching", u.stop_watching_count),
			),
		)}`,
		field("url", u.url),
	);
}

function formatActivity(a: Activity): string {
	const parts: (string | false)[] = [
		field("id", a.id),
		field("user", a.user.name),
		field("action", a.action),
		a.work ? field("work", a.work.title) : false,
		field("created_at", a.created_at.split("T")[0]),
	];

	if (a.record) {
		parts.push(field("rating", a.record.rating_state));
		parts.push(field("comment", a.record.comment));
	}
	if (a.review) {
		parts.push(field("review_body", a.review.body));
	}
	if (a.status) {
		parts.push(field("status", a.status.kind));
	}

	return lines(...parts);
}

function formatProgram(p: Program): string {
	const epText = p.episode.number_text || "";
	const epTitle = p.episode.title ? `「${p.episode.title}」` : "";

	return lines(
		field("id", p.id),
		field("work", p.work.title),
		field("episode", `${epText}${epTitle}`),
		field("channel", p.channel.name),
		field("started_at", p.started_at),
		field("is_rebroadcast", p.is_rebroadcast),
	);
}

function formatCast(c: Cast): string {
	return lines(
		field("id", c.id),
		field("character", c.character.name),
		field("name", c.name),
	);
}

function formatStaff(s: Staff): string {
	const name = s.name || s.organization?.name || "";
	const role = s.role_text || s.role_other || "";
	return lines(
		field("id", s.id),
		field("name", name),
		field("role", role),
	);
}

function formatPaginated<T>(
	result: PaginatedResponse<T>,
	key: keyof PaginatedResponse<T>,
	formatter: (item: T) => string,
): string {
	const items = result[key] as T[] | undefined;

	const page =
		result.next_page !== null
			? result.next_page - 1
			: result.prev_page !== null
				? result.prev_page + 1
				: null;

	const header = lines(
		`total_count: ${result.total_count}`,
		page !== null && `page: ${page}`,
	);

	if (!items || items.length === 0) {
		return `${header}\nitems: []`;
	}

	const formattedItems = items
		.map((item) => listItem(formatter(item)))
		.join("\n");
	return `${header}\nitems:\n${formattedItems}`;
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

export function formatActivities(
	result: PaginatedResponse<Activity>,
): string {
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
