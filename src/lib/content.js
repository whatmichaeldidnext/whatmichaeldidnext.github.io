import { loadCollection } from "./contentLoader.js";

let cachedContent = null;

export async function getContent() {
    if (cachedContent) return cachedContent;

    const [
        projects,
        domains,
        skills,
        tools,
        technologies,
        thinking,
        qualifications,
        artifacts,
    ] = await Promise.all([
        loadCollection("projects"),
        loadCollection("domains"),
        loadCollection("skills"),
        loadCollection("tools"),
        loadCollection("technologies"),
        loadCollection("thinking"),
        loadCollection("qualifications"),
        loadCollection("artifacts"),
    ]);

    cachedContent = {
        projects,
        domains,
        skills,
        tools,
        technologies,
        thinking,
        qualifications,
        artifacts,
    };

    return cachedContent;
}

export async function getCollection(name) {
    const content = await getContent();
    return content[name] ?? [];
}

export async function getById(collectionName, id) {
    const collection = await getCollection(collectionName);
    return collection.find((item) => item.id === id);
}

export async function getProjectRelations(project) {
    const { domains, skills, tools, technologies, thinking } = await getContent();

    return {
        domains: domains.filter((item) => project.domains?.includes(item.id)),
        skills: skills.filter((item) => project.skills?.includes(item.id)),
        tools: tools.filter((item) => project.tools?.includes(item.id)),
        technologies: technologies.filter((item) =>
            project.technologies?.includes(item.id)
        ),
        thinking: thinking.filter((item) => project.thinking?.includes(item.id)),
    };
}

export async function getProjectsForDomain(domainId) {
    const { projects } = await getContent();

    return projects.filter((project) =>
        project.domains?.includes(domainId)
    );
}

export async function getProjectsForSkill(skillId) {
    const { projects } = await getContent();

    return projects.filter((project) =>
        project.skills?.includes(skillId)
    );
}

export async function getSkillsForProjects(projects) {
    const { skills } = await getContent();

    const skillIds = [
        ...new Set(projects.flatMap((project) => project.skills || [])),
    ];

    return skills.filter((skill) => skillIds.includes(skill.id));
}

export async function getDomainsForProjects(projects) {
    const { domains } = await getContent();

    const domainIds = [
        ...new Set(projects.flatMap((project) => project.domains || [])),
    ];

    return domains.filter((domain) => domainIds.includes(domain.id));
}