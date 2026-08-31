import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function run() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--')) {
      const key = process.argv[i].slice(2);
      const val = process.argv[i + 1];
      args[key] = val;
      i++;
    }
  }

  const required = ['name', 'icon', 'duration', 'description', 'cover'];
  for (const req of required) {
    if (!args[req]) {
      console.error(`Missing required argument: --${req}`);
      console.log('Usage: node add-project.mjs --name "..." --icon "..." --duration "..." --description "..." --cover "..." [--links "[...]"]');
      process.exit(1);
    }
  }

  const slug = args.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  console.log(`Adding project: ${args.name} (${slug})`);

  // 1. Process cover image
  const destDir = path.join(process.cwd(), 'public/images/projects');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destCoverPath = path.join(destDir, `${slug}.webp`);
  const srcExt = path.extname(args.cover).toLowerCase();

  if (srcExt === '.webp') {
    fs.copyFileSync(args.cover, destCoverPath);
    console.log(`Copied WebP cover image to: ${destCoverPath}`);
  } else if (srcExt === '.jpg' || srcExt === '.jpeg' || srcExt === '.png') {
    const cwebpCmd = `cwebp -q 90 "${args.cover}" -o "${destCoverPath}"`;
    try {
      execSync(cwebpCmd, { stdio: 'ignore' });
    } catch {
      // Fallback to /opt/homebrew/bin/cwebp
      execSync(`/opt/homebrew/bin/cwebp -q 90 "${args.cover}" -o "${destCoverPath}"`, {
        stdio: 'inherit',
      });
    }
    console.log(`Successfully converted cover image to WebP: ${destCoverPath}`);
  } else {
    console.error(`Unsupported cover image extension: ${srcExt}`);
    process.exit(1);
  }

  // 2. Append the new entry to ProjectsConfig.tsx (the data file for the
  // ProjectSection). ProjectSection.tsx reads from this file — the
  // `coverImage` field per entry is the source of truth, so there's no
  // separate cover-images array to update in ProjectSection.tsx anymore.
  const projectsPath = path.join(process.cwd(), 'app/config/ProjectsConfig.tsx');
  if (!fs.existsSync(projectsPath)) {
    console.error(`Could not find ProjectsConfig.tsx at ${projectsPath}`);
    process.exit(1);
  }

  let projectsContent = fs.readFileSync(projectsPath, 'utf8');

  // Verify description formatting
  let descJsx;
  if (args.description.includes('<') || args.description.includes('>')) {
    descJsx = `(\n      <>\n        ${args.description}\n      </>\n    )`;
  } else {
    descJsx = JSON.stringify(args.description);
  }

  // Verify links parsing
  let linksParsed = [];
  if (args.links) {
    try {
      linksParsed = JSON.parse(args.links);
    } catch (e) {
      console.error('Failed to parse links JSON:', e.message);
      process.exit(1);
    }
  }

  const linksStr = '[\n' + linksParsed.map(link => `      {
        tooltip: ${JSON.stringify(link.tooltip)},
        link: ${JSON.stringify(link.link)},
        icon: getIcon(${JSON.stringify(link.icon || 'link')}),
      }`).join(',\n') + '\n    ]';

  const newProjectObj = `  {
    name: ${JSON.stringify(args.name)},
    icon: getIcon(${JSON.stringify(args.icon)}),
    duration: ${JSON.stringify(args.duration)},
    coverImage: "/images/projects/${slug}.webp",
    description: ${descJsx},
    links: ${linksStr},
  },
`;

  const lastCloseBracketIndex = projectsContent.lastIndexOf('];');
  if (lastCloseBracketIndex === -1) {
    console.error("Could not find ending array declaration '];' in ProjectsConfig.tsx");
    process.exit(1);
  }

  const updatedProjectsContent =
    projectsContent.substring(0, lastCloseBracketIndex) +
    newProjectObj +
    projectsContent.substring(lastCloseBracketIndex);

  fs.writeFileSync(projectsPath, updatedProjectsContent, 'utf8');
  console.log('Appended project data to ProjectsConfig.tsx');

  console.log('Project successfully added!');
}

run();
