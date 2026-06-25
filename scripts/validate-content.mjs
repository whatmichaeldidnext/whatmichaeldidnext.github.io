import fs from "fs";

const contentPath = "./src/content";

const files = [
    "projects.json",
    "domains.json",
    "skills.json",
    "technologies.json",
    "tools.json",
    "thinking.json",
    "qualifications.json",
    "artifacts.json",
];

let hasErrors = false;

const ids = {};

for (const file of files) {
    let data;

    try {
        data = JSON.parse(fs.readFileSync(`${contentPath}/${file}`, "utf8"));
    } catch (error) {
        console.error(`❌ Invalid JSON in ${file}`);
        console.error(error.message);
        process.exit(1);
    }
    ids[file] = new Set();

    for (const item of data) {
        if (ids[file].has(item.id)) {
            console.error(`❌ Duplicate ID '${item.id}' in ${file}`);
            hasErrors = true;
        }

        ids[file].add(item.id);
    }

    console.log(`✓ ${file}: ${data.length} records`);
}

const projects = JSON.parse(
    fs.readFileSync(`${contentPath}/projects.json`, "utf8")
);

const checkReferences = (project, field, targetFile) => {
    if (!project[field]) return;

    for (const id of project[field]) {
        if (!ids[targetFile].has(id)) {
            console.error(
                `❌ Project '${project.id}' references missing ${field}: '${id}'`
            );
            hasErrors = true;
        }
    }
};

for (const project of projects) {
    checkReferences(project, "domains", "domains.json");
    checkReferences(project, "skills", "skills.json");
    checkReferences(project, "technologies", "technologies.json");
    checkReferences(project, "tools", "tools.json");
    checkReferences(project, "thinking", "thinking.json");
    checkReferences(project, "qualifications", "qualifications.json");
    checkReferences(project, "artifacts", "artifacts.json");
}

if (hasErrors) {
    console.error("\nValidation failed.");
    process.exit(1);
}

console.log("\n✓ Content validation passed.");