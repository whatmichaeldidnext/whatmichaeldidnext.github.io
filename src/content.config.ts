import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Helpers
 */

const visibility = z
	.enum(["public", "private", "restricted"])
	.optional()
	.default("public");

const completionStatus = z.enum([
	"Completed",
	"In Progress",
	"In Planning",
	"Not Started",
]);

const lifecycleStatus = z.enum([
	"planned",
	"active",
	"completed",
	"archived",
]);

/**
 * Accepts:
 * - undefined
 * - null
 * - ""
 * - "single-value"
 * - ["multiple", "values"]
 *
 * Always returns string[]
 */
const stringArray = z.preprocess(
	(value) => {
		if (value === undefined || value === null || value === "") return [];
		if (Array.isArray(value)) return value;
		if (typeof value === "string") return [value];
		return value;
	},
	z.array(z.string())
);

/**
 * Useful for optional date fields coming from CMS.
 * Prevents null / empty string from failing z.coerce.date().
 */
const optionalDate = z.preprocess(
	(value) => {
		if (value === undefined || value === null || value === "") return undefined;
		return value;
	},
	z.coerce.date().optional()
);

const optionalString = z.preprocess(
	(value) => {
		if (value === undefined || value === null || value === "") return undefined;
		return value;
	},
	z.string().optional()
);

/**
 * Base schemas
 */

const baseEntity = z.object({
	id: z.string(),
	name: optionalString,
	title: optionalString,
	description: optionalString,
	featured: z.boolean().optional().default(false),
	visibility,
	tags: stringArray,
});

/**
 * Use this for collections where `category` is now a multiselect.
 *
 * The CMS field can still be called `category`,
 * but the saved value should now be:
 *
 * category: ["mindset", "strategy"]
 */
const categorizableEntity = baseEntity.extend({
	category: stringArray,
});

/**
 * Projects
 */

const projects = defineCollection({
	loader: glob({
		base: "./src/content/projects",
		pattern: "**/*.json",
	}),
	schema: z.object({
		id: z.string(),
		title: z.string(),
		slug: optionalString,

		parentProject: optionalString,

		compStatus: completionStatus.optional(),
		status: lifecycleStatus.optional().default("active"),

		summary: optionalString,
		context: optionalString,
		challenge: optionalString,
		approach: optionalString,
		outcome: optionalString,
		lessons: optionalString,

		role: stringArray,

		impact: z
			.object({
				whyItMattered: optionalString,
				publicValue: stringArray,
				organisationalValue: stringArray,
				stakeholders: stringArray,
			})
			.optional(),

		from: optionalDate,
		to: optionalDate,

		featured: z.boolean().optional().default(false),
		visibility,

		employer: z
			.object({
				id: optionalString,
				relationship: optionalString,
				roleTitle: optionalString,
			})
			.optional(),

		domains: stringArray,
		skills: stringArray,
		technologies: stringArray,
		tools: stringArray,
		thinking: stringArray,
		artifacts: stringArray,
		qualifications: stringArray,
		relatedProjects: stringArray,

		links: z
			.array(
				z.object({
					label: optionalString,
					url: optionalString,
					type: optionalString,
				})
			)
			.optional()
			.default([]),
	}),
});

/**
 * Categorizable JSON collections
 */

const domains = defineCollection({
	loader: glob({
		base: "./src/content/domains",
		pattern: "**/*.json",
	}),
	schema: categorizableEntity,
});

const skills = defineCollection({
	loader: glob({
		base: "./src/content/skills",
		pattern: "**/*.json",
	}),
	schema: categorizableEntity,
});

const tools = defineCollection({
	loader: glob({
		base: "./src/content/tools",
		pattern: "**/*.json",
	}),
	schema: categorizableEntity.extend({
		vendor: optionalString,
		homepage: optionalString,
	}),
});

const thinking = defineCollection({
	loader: glob({
		base: "./src/content/thinking",
		pattern: "**/*.json",
	}),
	schema: categorizableEntity,
});

/**
 * Non-multiselect entity collections
 */

const technologies = defineCollection({
	loader: glob({
		base: "./src/content/technologies",
		pattern: "**/*.json",
	}),
	schema: baseEntity.extend({
		category: optionalString,
	}),
});

const organisations = defineCollection({
	loader: glob({
		base: "./src/content/organisations",
		pattern: "**/*.json",
	}),
	schema: baseEntity.extend({
		category: optionalString,
		website: optionalString,
		logo: optionalString,
		location: optionalString,
		from: optionalDate,
		to: optionalDate,
		relationship: optionalString,
		role: optionalString,
	}),
});

/**
 * Blog
 */

const blog = defineCollection({
	loader: glob({
		base: "./src/content/blog",
		pattern: "**/*.{md,mdx}",
	}),
	schema: z.object({
		title: z.string(),
		slug: optionalString,
		summary: optionalString,

		published: optionalDate,
		updated: optionalDate,

		featured: z.boolean().optional().default(false),
		visibility,

		category: stringArray,

		relatedProjects: stringArray,
		relatedDomains: stringArray,
		relatedSkills: stringArray,
		relatedTechnologies: stringArray,
		relatedTools: stringArray,
		relatedEvidence: stringArray,

		tags: stringArray,
	}),
});

export const collections = {
	blog,
	projects,
	domains,
	skills,
	technologies,
	tools,
	thinking,
	organisations,
};import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const baseEntity = z.object({
	id: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	category: z.string().optional(),
	featured: z.boolean().optional().default(false),
	visibility: z.enum(["public", "private", "restricted"]).optional().default("public"),
	tags: z.array(z.string()).optional().default([]),
});

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.json" }),
	schema: z.object({
		id: z.string(),
		slug: z.string(),
		title: z.string(),
		summary: z.string().optional(),
		context: z.string().optional(),
		challenge: z.string().optional(),
		approach: z.string().optional(),
		outcome: z.string().optional(),
		lessons: z.string().optional(),
		from: z.coerce.date().optional(),
		to: z.coerce.date().optional(),
		featured: z.boolean().optional().default(false),
		visibility: z.enum(["public", "private", "restricted"]).optional().default("public"),
		domains: z.array(z.string()).optional().default([]),
		skills: z.array(z.string()).optional().default([]),
		technologies: z.array(z.string()).optional().default([]),
		tools: z.array(z.string()).optional().default([]),
		thinking: z.array(z.string()).optional().default([]),
		artifacts: z.array(z.string()).optional().default([]),
		qualifications: z.array(z.string()).optional().default([]),
		relatedProjects: z.array(z.string()).optional().default([]),
	}),
});

const domains = defineCollection({
	loader: glob({ base: "./src/content/domains", pattern: "**/*.json" }),
	schema: baseEntity,
});

const skills = defineCollection({
	loader: glob({ base: "./src/content/skills", pattern: "**/*.json" }),
	schema: baseEntity,
});

const technologies = defineCollection({
	loader: glob({ base: "./src/content/technologies", pattern: "**/*.json" }),
	schema: baseEntity,
});

const tools = defineCollection({
	loader: glob({ base: "./src/content/tools", pattern: "**/*.json" }),
	schema: baseEntity.extend({
		vendor: z.string().optional(),
		homepage: z.string().optional(),
	}),
});

const thinking = defineCollection({
	loader: glob({ base: "./src/content/thinking", pattern: "**/*.json" }),
	schema: baseEntity,
});

const organisations = defineCollection({
	loader: glob({ base: "./src/content/organisations", pattern: "**/*.json" }),
	schema: baseEntity.extend({
		website: z.string().optional(),
		logo: z.string().optional(),
		location: z.string().optional(),
		from: z.coerce.date().optional(),
		to: z.coerce.date().optional(),
		relationship: z.string().optional(),
		role: z.string().optional(),
	}),
});

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		summary: z.string().optional(),
		published: z.coerce.date().optional(),
		updated: z.coerce.date().optional(),
		featured: z.boolean().optional().default(false),
		visibility: z.enum(["public", "private", "restricted"]).optional().default("public"),
		category: z.string().optional(),
		relatedProjects: z.array(z.string()).optional().default([]),
		relatedDomains: z.array(z.string()).optional().default([]),
		relatedSkills: z.array(z.string()).optional().default([]),
		relatedTechnologies: z.array(z.string()).optional().default([]),
		relatedTools: z.array(z.string()).optional().default([]),
		relatedEvidence: z.array(z.string()).optional().default([]),
		tags: z.array(z.string()).optional().default([]),
	}),
});

export const collections = {
	blog,
	projects,
	domains,
	skills,
	technologies,
	tools,
	thinking,
	organisations,
};
