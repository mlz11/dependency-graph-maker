import { create } from 'zustand'
import type { UserStory } from '../types/story'

interface StoryState {
  stories: UserStory[]
  selectedStoryId: string | null
  draggedStoryId: string | null
  hoveredStoryId: string | null
  addStory: (story: Omit<UserStory, 'id'>) => void
  updateStory: (id: string, updates: Partial<UserStory>) => void
  deleteStory: (id: string) => void
  selectStory: (id: string | null) => void
  updateStoryPosition: (id: string, position: { x: number; y: number }) => void
  setDraggedStory: (id: string | null) => void
  setHoveredStory: (id: string | null) => void
  createDependency: (dependentId: string, dependsOnId: string) => void
  removeDependency: (dependentId: string, dependsOnId: string) => void
  getDependencies: () => Array<{ from: string; to: string }>
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  selectedStoryId: null,
  draggedStoryId: null,
  hoveredStoryId: null,

  addStory: (story) =>
    set((state) => ({
      stories: [
        ...state.stories,
        { ...story, id: crypto.randomUUID(), dependencies: [] },
      ],
    })),

  updateStory: (id, updates) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === id ? { ...story, ...updates } : story
      ),
    })),

  deleteStory: (id) =>
    set((state) => ({
      stories: state.stories.filter((story) => story.id !== id),
      selectedStoryId:
        state.selectedStoryId === id ? null : state.selectedStoryId,
    })),

  selectStory: (id) =>
    set(() => ({
      selectedStoryId: id,
    })),

  updateStoryPosition: (id, position) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === id ? { ...story, position } : story
      ),
    })),

  setDraggedStory: (id) =>
    set(() => ({
      draggedStoryId: id,
    })),

  setHoveredStory: (id) =>
    set(() => ({
      hoveredStoryId: id,
    })),

  createDependency: (dependentId, dependsOnId) =>
    set((state) => {
      // Prevent self-dependency
      if (dependentId === dependsOnId) return state

      // Check if dependency already exists
      const dependentStory = state.stories.find((s) => s.id === dependentId)
      if (
        dependentStory &&
        dependentStory.dependencies?.includes(dependsOnId)
      ) {
        return state
      }

      // TODO: Add circular dependency check in future iteration
      return {
        stories: state.stories.map((story) =>
          story.id === dependentId
            ? {
                ...story,
                dependencies: [...(story.dependencies || []), dependsOnId],
              }
            : story
        ),
      }
    }),

  removeDependency: (dependentId, dependsOnId) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === dependentId
          ? {
              ...story,
              dependencies: (story.dependencies || []).filter(
                (id) => id !== dependsOnId
              ),
            }
          : story
      ),
    })),

  getDependencies: () => {
    const state = useStoryStore.getState()
    const dependencies: Array<{ from: string; to: string }> = []

    state.stories.forEach((story) => {
      ;(story.dependencies || []).forEach((dependencyId) => {
        dependencies.push({ from: dependencyId, to: story.id })
      })
    })

    return dependencies
  },
}))
