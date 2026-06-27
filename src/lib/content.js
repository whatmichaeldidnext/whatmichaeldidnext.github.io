import { getCollection as astroGetCollection } from "astro:content";

let cachedContent = null;

const collectionNames = [
    "projects",
    "domains",
    "skills",
    "tools",
    "technologies",
    "thinking",
    "organisations",
    "qualifications",
    "artifacts",
    "blog",
];

function unwrap(entry) {
    return entry?.data ?? entry;
}

function sortByLabel(a, b) {
    const itemA = unwrap(a);
    const itemB = unwrap(b);

    return (itemA.title || itemA.name || itemA.id || "").localeCompare(
        itemB.title || itemB.name || itemB.id || ""
    );
}

export async function getContent() {
    if (cachedContent) return cachedContent;

    const loaded = await Promise.all(
        collectionNames.map(async (name) => {
            try {
                const entries = await astroGetCollection(name);
                return [name, entries.sort(sortByLabel)];
            } catch {
                return [name, []];
            }
        })
    );

    cachedContent = Object.fromEntries(loaded);
    return cachedContent;
}

export async function getCollection(name) {
    const content = await getContent();
    return content[name] ?? [];
}

export async function getPlainCollection(name) {
    const collection = await getCollection(name);
    return collection.map((entry) => entry.data);
}

export async function getById(collectionName, id) {
    const collection = await getCollection(collectionName);
    return collection.find((entry) => entry.data.id === id) ?? null;
}

export async function getProjectRelations(projectEntry) {
    const project = unwrap(projectEntry);
    const { domains, skills, tools, technologies, thinking } = await getContent();

    return {
        domains: domains.filter((item) => project.domains?.includes(item.data.id)),
        skills: skills.filter((item) => project.skills?.includes(item.data.id)),
        tools: tools.filter((item) => project.tools?.includes(item.data.id)),
        technologies: technologies.filter((item) =>
            project.technologies?.includes(item.data.id)
        ),
        thinking: thinking.filter((item) =>
            project.thinking?.includes(item.data.id)
        ),
    };
}

export async function getProjectsForDomain(domainId) {
    const projects = await getCollection("projects");
    return projects.filter((project) => project.data.domains?.includes(domainId));
}

export async function getProjectsForSkill(skillId) {
    const projects = await getCollection("projects");
    return projects.filter((project) => project.data.skills?.includes(skillId));
}

export async function getSkillsForProjects(projectEntries) {
    const skills = await getCollection("skills");

    const skillIds = [
        ...new Set(
            projectEntries.flatMap((project) => unwrap(project).skills ?? [])
        ),
    ];

    return skills.filter((skill) => skillIds.includes(skill.data.id));
}

export async function getDomainsForProjects(projectEntries) {
    const domains = await getCollection("domains");

    const domainIds = [
        ...new Set(
            projectEntries.flatMap((project) => unwrap(project).domains ?? [])
        ),
    ];

    return domains.filter((domain) => domainIds.includes(domain.data.id));
}