import fs from "node:fs";
import path from "node:path";

const files = [
    "src/pages/projects/[id].astro",
    "src/pages/domains/[id].astro",
    "src/pages/skills/[id].astro",
];

function backup(file) {
    fs.copyFileSync(file, `${file}.bak`);
}

function replaceBetweenFrontmatter(source, newFrontmatter) {
    const match = source.match(/^---[\s\S]*?---/);
    if (!match) throw new Error("No frontmatter found");
    return source.replace(match[0], newFrontmatter.trim());
}

const frontmatters = {
    "src/pages/projects/[id].astro": `
---
import MainLayout from "../../layouts/MainLayout.astro";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getGraph } from "../../lib/contentGraph.js";

export async function getStaticPaths() {
  const graph = await getGraph();

  return graph.getNodes("projects").map((node) => ({
    params: { id: node.id },
    props: { project: node.data },
  }));
}

const { project } = Astro.props;
const graph = await getGraph();

const relatedDomains = graph.domainsFor("projects", project.id);
const relatedSkills = graph.skillsFor("projects", project.id);
const relatedTools = graph.toolsFor("projects", project.id);
const relatedTechnologies = graph.technologiesFor("projects", project.id);
const relatedThinking = graph.thinkingFor("projects", project.id);
---
`,

    "src/pages/domains/[id].astro": `
---
import MainLayout from "../../layouts/MainLayout.astro";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getGraph } from "../../lib/contentGraph.js";

export async function getStaticPaths() {
  const graph = await getGraph();

  return graph.getNodes("domains").map((node) => ({
    params: { id: node.id },
    props: { domain: node.data },
  }));
}

const { domain } = Astro.props;
const graph = await getGraph();

const relatedProjects = graph.projectsFor("domains", domain.id);
const relatedSkills = graph.skillsFor("domains", domain.id);
---
`,

    "src/pages/skills/[id].astro": `
---
import MainLayout from "../../layouts/MainLayout.astro";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getGraph } from "../../lib/contentGraph.js";

export async function getStaticPaths() {
  const graph = await getGraph();

  return graph.getNodes("skills").map((node) => ({
    params: { id: node.id },
    props: { skill: node.data },
  }));
}

const { skill } = Astro.props;
const graph = await getGraph();

const relatedProjects = graph.projectsFor("skills", skill.id);
const relatedDomains = graph.domainsFor("skills", skill.id);
---
`,
};

for (const file of files) {
    if (!fs.existsSync(file)) {
        console.warn(`Skipping missing file: ${file}`);
        continue;
    }

    backup(file);

    const source = fs.readFileSync(file, "utf8");
    const updated = replaceBetweenFrontmatter(source, frontmatters[file]);

    fs.writeFileSync(file, updated);
    console.log(`Updated ${file}`);
}

console.log("Done. Backups created as *.bak files.");