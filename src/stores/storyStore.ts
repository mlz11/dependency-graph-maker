import { create } from 'zustand'
import type { UserStory, DragState } from '../types/story'
import {
  calculateHierarchicalLayout,
  hasCircularDependency,
} from '../utils/layoutUtils'

interface StoryState {
  stories: UserStory[]
  selectedStoryId: string | null
  dragState: DragState
  addStory: (story: Omit<UserStory, 'id'>) => void
  updateStory: (id: string, updates: Partial<UserStory>) => void
  deleteStory: (id: string) => void
  selectStory: (id: string | null) => void
  updateStoryPosition: (id: string, position: { x: number; y: number }) => void
  setDragState: (dragState: Partial<DragState>) => void
  addDependency: (dependentId: string, dependencyId: string) => void
  removeDependency: (dependentId: string, dependencyId: string) => void
  arrangeHierarchically: () => void
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  selectedStoryId: null,
  dragState: {
    isDragging: false,
    draggedStoryId: null,
    hoverTargetId: null,
  },

  addStory: (story) =>
    set((state) => ({
      stories: [...state.stories, { ...story, id: crypto.randomUUID() }],
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

  setDragState: (dragState) =>
    set((state) => ({
      dragState: { ...state.dragState, ...dragState },
    })),

  addDependency: (dependentId, dependencyId) =>
    set((state) => {
      // Create temporary updated stories to check for circular dependencies
      const updatedStories = state.stories.map((story) =>
        story.id === dependentId
          ? {
              ...story,
              dependencies: [...(story.dependencies || []), dependencyId],
            }
          : story
      )

      // Check for circular dependencies
      if (hasCircularDependency(updatedStories)) {
        console.warn('Cannot add dependency: would create circular dependency')
        return state // Don't update if it would create a cycle
      }

      return {
        stories: updatedStories,
      }
    }),

  removeDependency: (dependentId, dependencyId) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === dependentId
          ? {
              ...story,
              dependencies: (story.dependencies || []).filter(
                (id) => id !== dependencyId
              ),
            }
          : story
      ),
    })),

  arrangeHierarchically: () =>
    set((state) => {
      const layoutNodes = calculateHierarchicalLayout(state.stories)
      const updatedStories = state.stories.map((story) => {
        const layoutNode = layoutNodes.find((node) => node.id === story.id)
        return layoutNode
          ? { ...story, position: { x: layoutNode.x, y: layoutNode.y } }
          : story
      })

      return {
        stories: updatedStories,
      }
    }),
}))
