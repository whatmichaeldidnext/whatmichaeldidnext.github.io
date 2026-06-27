import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const baseEntity = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	summary: z.string().optional(),
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