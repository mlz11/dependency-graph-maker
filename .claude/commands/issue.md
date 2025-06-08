# Issue Command

This command workflow is used to work on GitHub issues systematically.

## Workflow

1. **Fetch issue details**: Use `gh issue view $ARGUMENTS` to read the issue content and requirements
2. **Create feature branch**: Checkout a new branch from main using format `issue/{number}-{brief-description}`
3. **Plan implementation**: Create a markdown TODO file listing all tasks needed to address the issue
4. **Implement with testing**: For each task:
   - Implement the changes
   - Test functionality using Puppeteer MCP when applicable
   - Run all quality checks (lint, typecheck, tests)
   - Commit changes with conventional commit messages
5. **Validate completion**: Ensure all issue requirements are met before considering the work complete

## Quality Standards

- All commits must pass pre-commit hooks (formatting, linting, type checking, tests)
- Use conventional commit format: `feat:`, `fix:`, `refactor:`, etc.
- Test visual/interactive features with Puppeteer MCP
- Never include Claude attribution in commit messages (per CLAUDE.md guidance)
