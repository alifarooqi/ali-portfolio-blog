---
name: homepage-sections
description: Used when adding, removing, reordering, or editing homepage sections or managing homepage configuration and radial menu navigation.
---

# Homepage Section Configuration & Navigation

This skill outlines how to manage the config-driven layout of the portfolio homepage.

## How to Add a Section

1. **Register the Section:** Add an entry to the registry in [SectionConfig.ts](file:///Users/ali/codes-ali/ali-portfolio-blog/app/config/SectionConfig.ts) containing `key`, `name`, `headerIconKey`, and optional `notInMenu`.
2. **Create the Component:** Drop your new section component file inside `app/components/sections/`.
3. **Render the Section:** Render the new component from [page.tsx](file:///Users/ali/codes-ali/ali-portfolio-blog/app/page.tsx).

## Architectural Guidelines

- **Config-Driven Layout:** All homepage content should be config-driven, not hardcoded into pages.
- **Section wrapper ([Section.tsx](file:///Users/ali/codes-ali/ali-portfolio-blog/app/components/Section/Section.tsx)):** A client component that assigns IDs, tracks scroll-spy `section-active` classes, and staggers child entrance animations using Framer Motion.
- **Radial Menu ([Menu.tsx](file:///Users/ali/codes-ali/ali-portfolio-blog/app/components/Menu/Menu.tsx)):** Builds its circular list dynamically from `SectionConfig`. Section-scroll links only render on the home route (`/`).
