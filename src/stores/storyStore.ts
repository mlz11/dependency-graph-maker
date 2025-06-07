import { create } from 'zustand'
import type { UserStory } from '../types/story'

interface StoryState {
  stories: UserStory[]
  selectedStoryId: string | null
  addStory: (story: Omit<UserStory, 'id'>) => void
  updateStory: (id: string, updates: Partial<UserStory>) => void
  deleteStory: (id: string) => void
  selectStory: (id: string | null) => void
  updateStoryPosition: (id: string, position: { x: number; y: number }) => void
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  selectedStoryId: null,

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
}))
