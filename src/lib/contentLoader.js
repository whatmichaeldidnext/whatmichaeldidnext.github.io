export async function loadCollection(collectionName) {
    const modules = import.meta.glob("../content/*/*.json", { eager: true });

    return Object.entries(modules)
        .filter(([path]) => path.includes(`/content/${collectionName}/`))
        .map(([, module]) => module.default)
        .sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
}