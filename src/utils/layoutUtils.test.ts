import { describe, it, expect } from 'vitest'
import {
  calculateHierarchicalLayout,
  hasCircularDependency,
} from './layoutUtils'
import type { UserStory } from '../types/story'

const createMockStory = (id: string, dependencies?: string[]): UserStory => ({
  id,
  title: `Story ${id}`,
  status: 'todo',
  position: { x: 0, y: 0 },
  dependencies,
})

describe('layoutUtils', () => {
  describe('calculateHierarchicalLayout', () => {
    it('should position single story', () => {
      const stories = [createMockStory('1')]
      const layout = calculateHierarchicalLayout(stories)

      expect(layout).toHaveLength(1)
      expect(layout[0].id).toBe('1')
      expect(typeof layout[0].x).toBe('number')
      expect(typeof layout[0].y).toBe('number')
    })

    it('should arrange stories with dependencies vertically', () => {
      const stories = [
        createMockStory('1'),
        createMockStory('2', ['1']), // Story 2 depends on Story 1
      ]
      const layout = calculateHierarchicalLayout(stories)

      expect(layout).toHaveLength(2)

      const story1Layout = layout.find((l) => l.id === '1')
      const story2Layout = layout.find((l) => l.id === '2')

      expect(story1Layout).toBeDefined()
      expect(story2Layout).toBeDefined()

      // Story 1 should be above Story 2 (smaller y value)
      expect(story1Layout!.y).toBeLessThan(story2Layout!.y)
    })

    it('should handle multiple dependencies', () => {
      const stories = [
        createMockStory('1'),
        createMockStory('2'),
        createMockStory('3', ['1', '2']), // Story 3 depends on both 1 and 2
      ]
      const layout = calculateHierarchicalLayout(stories)

      expect(layout).toHaveLength(3)

      const story1Layout = layout.find((l) => l.id === '1')
      const story2Layout = layout.find((l) => l.id === '2')
      const story3Layout = layout.find((l) => l.id === '3')

      expect(story1Layout).toBeDefined()
      expect(story2Layout).toBeDefined()
      expect(story3Layout).toBeDefined()

      // Stories 1 and 2 should be above Story 3
      expect(story1Layout!.y).toBeLessThan(story3Layout!.y)
      expect(story2Layout!.y).toBeLessThan(story3Layout!.y)
    })
  })

  describe('hasCircularDependency', () => {
    it('should return false for stories with no dependencies', () => {
      const stories = [createMockStory('1'), createMockStory('2')]

      expect(hasCircularDependency(stories)).toBe(false)
    })

    it('should return false for valid linear dependencies', () => {
      const stories = [
        createMockStory('1'),
        createMockStory('2', ['1']),
        createMockStory('3', ['2']),
      ]

      expect(hasCircularDependency(stories)).toBe(false)
    })

    it('should return true for direct circular dependency', () => {
      const stories = [createMockStory('1', ['2']), createMockStory('2', ['1'])]

      expect(hasCircularDependency(stories)).toBe(true)
    })

    it('should return true for indirect circular dependency', () => {
      const stories = [
        createMockStory('1', ['2']),
        createMockStory('2', ['3']),
        createMockStory('3', ['1']),
      ]

      expect(hasCircularDependency(stories)).toBe(true)
    })

    it('should return false for complex valid dependency graph', () => {
      const stories = [
        createMockStory('1'),
        createMockStory('2'),
        createMockStory('3', ['1']),
        createMockStory('4', ['1', '2']),
        createMockStory('5', ['3', '4']),
      ]

      expect(hasCircularDependency(stories)).toBe(false)
    })
  })
})
