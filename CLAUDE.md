## Project Overview

This is a user story dependency visualization tool that helps teams visualize and manage dependencies between their user stories. The goal is to connect to databases of user stories (primarily Notion) and enable drag-and-drop creation of dependency relationships.

## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build the project for production
- `npm test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI interface
- `npm run test:e2e` - Run E2E tests with Puppeteer
- `npm run lint` - Run ESLint
- `npm run lint:check` - Check ESLint rules with zero tolerance for warnings
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Pre-commit Hooks

The project uses Husky to enforce code quality before commits. The pre-commit hook runs:

1. TypeScript type checking (`npm run build`)
2. Code formatting check (`npm run format:check`)
3. ESLint rules validation (`npm run lint:check`)
4. Unit tests (`npm test -- --run`)
5. E2E tests (if dev server is running on localhost:5173)

## Guidance

- Always check that development server is not already started before starting it
- Never include Claude attribution or references in commit messages
- Use conventional commits specification for all commit messages
- Only create pull requests when explicitly requested
