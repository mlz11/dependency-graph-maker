# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture

### Tech Stack

- **Frontend**: React 19 + TypeScript
- **Canvas**: HTML5 Canvas with Konva.js and react-konva
- **State Management**: Zustand
- **Testing**: Vitest + React Testing Library + Puppeteer
- **Build Tool**: Vite
- **Code Formatting**: Prettier
- **Pre-commit Hooks**: Husky

### Key Components

- `StoryCanvas` - Main canvas component handling user story visualization
- `StoryCard` - Individual story card component with drag functionality
- `useStoryStore` - Zustand store managing story state and operations

### Data Flow

- User stories are stored in Zustand store with position coordinates
- Canvas renders stories as draggable Konva components
- Drag operations update story positions in real-time
- Selection state managed globally for multi-story operations

### File Structure

- `/src/components/` - React components
- `/src/stores/` - Zustand state management
- `/src/types/` - TypeScript type definitions
- `/src/test/` - Test setup and utilities
- `/tests/e2e/` - End-to-end tests

## Pre-commit Hooks

The project uses Husky to enforce code quality before commits. The pre-commit hook runs:

1. TypeScript type checking (`npm run build`)
2. Code formatting check (`npm run format:check`)
3. ESLint rules validation (`npm run lint:check`)
4. Unit tests (`npm test -- --run`)
5. E2E tests (if dev server is running on localhost:5173)

## Guidance

- Do not include Claude attribution or references in commit messages
- Use conventional commits specification for all commit messages
- Only create pull requests when explicitly requested
