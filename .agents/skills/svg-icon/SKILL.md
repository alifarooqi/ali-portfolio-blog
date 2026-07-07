---
name: svg-icon
description: Used when adding, converting, or registering new SVG icons in the icons component.
---

# SVG Icon Conversion & Registration

This skill provides instructions for converting custom SVGs into React components and registering them in the centralized icons registry.

## Workflow

1. Navigate to the icons directory: `app/components/icons/`.
2. Convert the SVG file into a motion-enabled React component by running the SVGR CLI command:
   ```bash
   npx @svgr/cli ./ --template svgr-motion-template.js --out-dir ./ --ext tsx --no-svgo
   ```
3. Register the new icon component in the `Icons` map inside [Icons.tsx](file:///Users/ali/codes-ali/ali-portfolio-blog/app/components/icons/Icons.tsx) to make it available via `getIcon(key)`.
