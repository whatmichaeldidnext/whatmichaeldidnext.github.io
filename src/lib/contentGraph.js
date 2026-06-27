import { getPlainCollection } from "./content.js";

const graphCollections = {
    projects: "project",
    domains: "domain",
    skills: "skill",
    tools: "tool",
    technologies: "technology",
    thinking: "thinking",
    artifacts: "artifact",
    qualifications: "qualification",
};

export async function buildContentGraph() {
    const content = {};

    for (const collectionName of Object.keys(graphCollections)) {
        content[collectionName] = await getPlainCollection(collectionName);
    }

    const nodes = [];
    const edges = [];

    for (const [collectionName, type] of Object.entries(graphCollections)) {
        for (const item of content[collectionName] ?? []) {
            nodes.push({
                id: item.id,
                slug: item.slug,
                type,
                label: item.title || item.name || item.id,
                item,
            });
        }
    }

    const addEdge = (sourceType, sourceId, targetType, targetId, relationship) => {
        if (!sourceId || !targetId) return;

        edges.push({
            id: `${sourceType}:${sourceId}->${targetType}:${targetId}:${relationship}`,
            sourceType,
            sourceId,
            targetType,
            targetId,
            relationship,
        });
    };

    for (const project of content.projects ?? []) {
        project.domains?.forEach((id) =>
            addEdge("project", project.id, "domain", id, "has-domain")
        );

        project.skills?.forEach((id) =>
            addEdge("project", project.id, "skill", id, "uses-skill")
        );

        project.tools?.forEach((id) =>
            addEdge("project", project.id, "tool", id, "uses-tool")
        );

        project.technologies?.forEach((id) =>
            addEdge("project", project.id, "technology", id, "uses-technology")
        );

        project.thinking?.forEach((id) =>
            addEdge("project", project.id, "thinking", id, "demonstrates-principle")
        );

        project.artifacts?.forEach((id) =>
            addEdge("project", project.id, "artifact", id, "has-evidence")
        );

        project.qualifications?.forEach((id) =>
            addEdge("project", project.id, "qualification", id, "supported-by")
        );

        if (project.parentProject) {
            addEdge(
                "project",
                project.id,
                "project",
                project.parentProject.replace(/^project-/, ""),
                "part-of"
            );
        }

        const dependencies = Array.isArray(project.dependsOn)
            ? project.dependsOn
            : project.dependsOn
                ? [project.dependsOn]
                : [];

        dependencies.forEach((id) =>
            addEdge(
                "project",
                project.id,
                "project",
                id.replace(/^project-/, ""),
                "depends-on"
            )
        );
    }

    const getNode = (type, id) =>
        nodes.find((node) => node.type === type && node.id === id) ?? null;

    const getItem = (collectionName, id) =>
        content[collectionName]?.find((item) => item.id === id) ?? null;

    const getConnectedNodes = (type, id) => {
        const connectedIds = edges
            .filter(
                (edge) =>
                    (edge.sourceType === type && edge.sourceId === id) ||
                    (edge.targetType === type && edge.targetId === id)
            )
            .flatMap((edge) => [
                {type: edge.sourceType, id: edge.sourceId},
                {type: edge.targetType, id: edge.targetId},
            ])
            .filter((node) => !(node.type === type && node.id === id));

        const unique = new Map(
            connectedIds.map((node) => [`${node.type}:${node.id}`, node])
        );

        return [...unique.values()]
            .map((node) => getNode(node.type, node.id))
            .filter(Boolean);
    };

    const projectsFor = (collectionName, id) => {
        const fieldMap = {
            domains: "domains",
            skills: "skills",
            tools: "tools",
            technologies: "technologies",
            thinking: "thinking",
            artifacts: "artifacts",
            qualifications: "qualifications",
        };

        const field = fieldMap[collectionName];

        if (!field) return [];

        return content.projects.filter((project) =>
            project[field]?.includes(id)
        );

    };
    const find = (collectionName, id) =>
        content[collectionName]?.find((item) => item.id === id) ?? null;

    return {
        content,
        nodes,
        edges,
        getNode,
        getItem,
        getConnectedNodes,
        projectsFor,
        find
    };
}

export async function getGraph() {
    return buildContentGraph();
}