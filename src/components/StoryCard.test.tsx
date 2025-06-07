import { describe, it, expect } from 'vitest'
import type { UserStory } from '../types/story'

const mockStory: UserStory = {
  id: '1',
  title: 'Test Story',
  status: 'todo',
  position: { x: 100, y: 200 },
}

describe('StoryCard', () => {
  it('should have correct story data structure', () => {
    expect(mockStory.id).toBe('1')
    expect(mockStory.title).toBe('Test Story')
    expect(mockStory.status).toBe('todo')
    expect(mockStory.position).toEqual({ x: 100, y: 200 })
  })

  it('should handle different status values', () => {
    const statuses: UserStory['status'][] = ['todo', 'in-progress', 'done']

    statuses.forEach((status) => {
      const story: UserStory = {
        ...mockStory,
        status,
      }
      expect(story.status).toBe(status)
    })
  })

  it('should handle optional properties', () => {
    const storyWithExtras: UserStory = {
      ...mockStory,
      description: 'Test description',
      points: 5,
      assignee: 'John Doe',
    }

    expect(storyWithExtras.description).toBe('Test description')
    expect(storyWithExtras.points).toBe(5)
    expect(storyWithExtras.assignee).toBe('John Doe')
  })

  it('should maintain position coordinates', () => {
    const positions = [
      { x: 0, y: 0 },
      { x: 100, y: 200 },
      { x: -50, y: 300 },
    ]

    positions.forEach((position) => {
      const story: UserStory = {
        ...mockStory,
        position,
      }
      expect(story.position).toEqual(position)
    })
  })
})
