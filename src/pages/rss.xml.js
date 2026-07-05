import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context) {
	const posts = await getCollection("blog");

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts
			.filter((post) => post.data.visibility !== "private")
			.map((post) => ({
				title: post.data.title,
				description: post.data.summary ?? post.data.title,
				pubDate: post.data.published ?? post.data.updated ?? new Date(),
				link: `/insights/${post.data.slug}/`,
			})),
	});
}