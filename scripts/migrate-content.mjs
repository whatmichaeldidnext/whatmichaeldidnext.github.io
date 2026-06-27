import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = "src/content";

const collections = [
    "artifacts",
    "domains",
    "projects",
    "qualifications",
    "skills",
    "technologies",
    "thinking",
    "tools"
];

function slugify(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getId(item, collection, index) {
    return (
        item.id ||
        item.slug ||
        slugify(item.title || item.name || item.label || `${collection}-${index + 1}`)
    );
}

for (const collection of collections) {
    const inputPath = path.join(CONTENT_DIR, `${collection}.json`);
    const outputDir = path.join(CONTENT_DIR, collection);

    if (!fs.existsSync(inputPath)) {
        console.warn(`Skipping missing file: ${inputPath}`);
        continue;
    }

    const raw = fs.readFileSync(inputPath, "utf8");
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
        throw new Error(`${inputPath} is not an array`);
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const seen = new Set();

    data.forEach((item, index) => {
        const id = getId(item, collection, index);

        if (seen.has(id)) {
            throw new Error(`Duplicate id "${id}" in ${collection}`);
        }

        seen.add(id);

        const normalised = {
            id,
            ...item
        };

        const outputPath = path.join(outputDir, `${id}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(normalised, null, 2) + "\n");
    });

    console.log(`✓ ${collection}: ${data.length} records`);
}