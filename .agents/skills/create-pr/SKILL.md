---
name: create-pr
description: Used when running the validation/testing pipeline and creating a new GitHub Pull Request.
---

# Create Pull Request (PR) Skill

This skill automates the testing and PR creation workflow. It ensures that the CI verification steps are run locally before creating a Pull Request on GitHub.

## Workflow

To run the full verification pipeline and create a PR, run the helper script:

```bash
node .agents/skills/create-pr/scripts/create-pr.mjs
```

The script will:
1. Run linting: `npm run lint`
2. Run TypeScript typechecking: `npm run typecheck`
3. Run unit tests: `npm run test`
4. Run E2E tests: `npm run test:e2e`
5. If all checks pass, it will initiate the PR creation via the `gh` CLI.

## Manual Workflow

If you prefer to run the steps manually:
1. Validate code:
   ```bash
   npm run lint && npm run typecheck && npm run test && npm run test:e2e
   ```
2. Create PR:
   ```bash
   gh pr create --web
   ```
