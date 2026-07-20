# Add Project Skill

Use this skill when adding a new project entry to the interactive portfolio gallery dashboard.

---

## Instructions

The helper script automates appending the project properties to `Projects.tsx`, adding the WebP cover image to `ProjectSection.tsx` `coverImages`, and converting the raw image assets.

### Usage

Run the script from the repository root:

```bash
node .agents/skills/add-project/scripts/add-project.mjs \
  --name "Project Name" \
  --icon "icon_key" \
  --duration "YYYY - YYYY" \
  --description "Project description with optional <b>bold</b> stack annotations." \
  --cover "/path/to/source_image.jpg" \
  --links '[{"tooltip": "See source", "link": "https://...", "icon": "code"}]'
```

### Parameter Details
* `--name`: (Required) Display title of the project.
* `--icon`: (Required) Icon name mapping to `Icons.tsx` (e.g. `security`, `energy`, `app`, `code`, `link`, `smartToy`, `videoGame`, `timer`, `chat`).
* `--duration`: (Required) Date or duration string (e.g., `"2025"`, `"2023 - 2024"`).
* `--description`: (Required) Detailed description. HTML bold tags `<b>...</b>` are parsed into React JSX bold markup automatically.
* `--cover`: (Required) Absolute or relative path to the project's cover image. The script automatically converts JPG/PNG images to optimized `.webp` via `cwebp` and copies them to `public/images/projects/`.
* `--links`: (Optional) JSON array string containing project link objects. Each link object supports `tooltip`, `link`, and `icon` properties.

---

## Verification Checklist

1. Confirm that the new project is listed in [Projects.tsx](file:///Users/ali/codes-ali/ali-portfolio-blog/app/components/sections/ProjectSection/Projects.tsx).
2. Confirm that the WebP image is added to the `coverImages` array in [ProjectSection.tsx](file:///Users/ali/codes-ali/ali-portfolio-blog/app/components/sections/ProjectSection/ProjectSection.tsx).
3. Verify that the optimized cover image exists at `public/images/projects/<project_slug>.webp`.
4. Run `npm run typecheck` and `npm run lint` to ensure zero compilation or syntax errors.
