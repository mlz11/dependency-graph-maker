import { describe, it, expect, beforeEach } from 'vitest'
import { useStoryStore } from './storyStore'

describe('StoryStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useStoryStore.setState({ stories: [], selectedStoryId: null })
  })

  it('should add a story', () => {
    const { addStory } = useStoryStore.getState()

    addStory({
      title: 'Test Story',
      description: 'Test description',
      status: 'todo',
      assignee: 'Test User',
      points: 3,
      position: { x: 100, y: 200 },
    })

    const updatedStories = useStoryStore.getState().stories
    expect(updatedStories).toHaveLength(1)
    expect(updatedStories[0]).toMatchObject({
      title: 'Test Story',
      description: 'Test description',
      status: 'todo',
      assignee: 'Test User',
      points: 3,
      position: { x: 100, y: 200 },
    })
    expect(updatedStories[0].id).toBeDefined()
  })

  it('should update story position', () => {
    const { addStory, updateStoryPosition } = useStoryStore.getState()

    addStory({
      title: 'Test Story',
      status: 'todo',
      position: { x: 100, y: 200 },
    })

    const storyId = useStoryStore.getState().stories[0].id
    updateStoryPosition(storyId, { x: 300, y: 400 })

    const updatedStory = useStoryStore.getState().stories[0]
    expect(updatedStory.position).toEqual({ x: 300, y: 400 })
  })

  it('should select and deselect stories', () => {
    const { addStory, selectStory } = useStoryStore.getState()

    addStory({
      title: 'Test Story',
      status: 'todo',
      position: { x: 100, y: 200 },
    })

    const storyId = useStoryStore.getState().stories[0].id

    // Select story
    selectStory(storyId)
    expect(useStoryStore.getState().selectedStoryId).toBe(storyId)

    // Deselect story
    selectStory(null)
    expect(useStoryStore.getState().selectedStoryId).toBeNull()
  })

  it('should delete a story', () => {
    const { addStory, deleteStory } = useStoryStore.getState()

    addStory({
      title: 'Test Story',
      status: 'todo',
      position: { x: 100, y: 200 },
    })

    const storyId = useStoryStore.getState().stories[0].id
    deleteStory(storyId)

    expect(useStoryStore.getState().stories).toHaveLength(0)
  })
})
