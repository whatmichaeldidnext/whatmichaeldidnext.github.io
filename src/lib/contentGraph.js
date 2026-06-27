import { getContent } from "./content.js";

const COLLECTIONS = [
    "projects",
    "domains",
    "skills",
    "tools",
    "technologies",
    "thinking",
    "qualifications",
    "artifacts",
];

const RELATION_FIELDS = {
    projects: ["domains", "skills", "tools", "technologies", "thinking", "artifacts"],
    domains: [],
    skills: [],
    tools: [],
    technologies: [],
    thinking: [],
    qualifications: [],
    artifacts: [],
};

let cachedGraph = null;

export async function getGraph() {
    if (cachedGraph) return cachedGraph;

    const content = await getContent();

    const nodes = COLLECTIONS.flatMap((collection) =>
        (content[collection] || []).map((item) => ({
            id: item.id,
            type: collection,
            label: item.title || item.name || item.id,
            data: item,
        }))
    );

    const nodeMap = new Map(
        nodes.map((node) => [`${node.type}:${node.id}`, node])
    );

    const edges = [];

    for (const sourceType of COLLECTIONS) {
        const items = content[sourceType] || [];
        const fields = RELATION_FIELDS[sourceType] || [];

        for (const item of items) {
            for (const field of fields) {
                const targetIds = item[field] || [];

                for (const targetId of targetIds) {
                    const targetType = field;
                    const sourceKey = `${sourceType}:${item.id}`;
                    const targetKey = `${targetType}:${targetId}`;

                    if (!nodeMap.has(targetKey)) continue;

                    edges.push({
                        source: sourceKey,
                        target: targetKey,
                        sourceType,
                        sourceId: item.id,
                        targetType,
                        targetId,
                        relation: field,
                    });
                }
            }
        }
    }

    cachedGraph = createGraphApi({ content, nodes, edges, nodeMap });

    return cachedGraph;
}

function createGraphApi({ content, nodes, edges, nodeMap }) {
    function key(type, id) {
        return `${type}:${id}`;
    }

    function getNode(type, id) {
        return nodeMap.get(key(type, id)) || null;
    }

    function getNodes(type = null) {
        return type ? nodes.filter((node) => node.type === type) : nodes;
    }

    function getEdges(filter = {}) {
        return edges.filter((edge) => {
            return Object.entries(filter).every(([field, value]) => {
                if (value === undefined || value === null) return true;
                return edge[field] === value;
            });
        });
    }

    function outgoing(type, id) {
        const sourceKey = key(type, id);
        return edges
            .filter((edge) => edge.source === sourceKey)
            .map((edge) => nodeMap.get(edge.target))
            .filter(Boolean);
    }

    function incoming(type, id) {
        const targetKey = key(type, id);
        return edges
            .filter((edge) => edge.target === targetKey)
            .map((edge) => nodeMap.get(edge.source))
            .filter(Boolean);
    }

    function related(type, id, targetType = null) {
        const connected = [...outgoing(type, id), ...incoming(type, id)];

        const unique = new Map(
            connected.map((node) => [`${node.type}:${node.id}`, node])
        );

        const results = [...unique.values()];

        return targetType
            ? results.filter((node) => node.type === targetType)
            : results;
    }

    function relatedData(type, id, targetType = null) {
        return related(type, id, targetType).map((node) => node.data);
    }

    function find(collection, id) {
        return content[collection]?.find((item) => item.id === id) || null;
    }

    function projectsFor(type, id) {
        if (type === "projects") return [find("projects", id)].filter(Boolean);

        return relatedData(type, id, "projects");
    }

    function domainsFor(type, id) {
        return relatedData(type, id, "domains");
    }

    function skillsFor(type, id) {
        return relatedData(type, id, "skills");
    }

    function toolsFor(type, id) {
        return relatedData(type, id, "tools");
    }

    function technologiesFor(type, id) {
        return relatedData(type, id, "technologies");
    }

    function thinkingFor(type, id) {
        return relatedData(type, id, "thinking");
    }

    return {
        content,
        nodes,
        edges,
        getNode,
        getNodes,
        getEdges,
        outgoing,
        incoming,
        related,
        relatedData,
        find,
        projectsFor,
        domainsFor,
        skillsFor,
        toolsFor,
        technologiesFor,
        thinkingFor,
    };
}