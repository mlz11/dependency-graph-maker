export interface UserStory {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  assignee?: string
  points?: number
  position: {
    x: number
    y: number
  }
  dependencies?: string[] // Array of story IDs that this story depends on
}

export interface DragState {
  isDragging: boolean
  draggedStoryId: string | null
  hoverTargetId: string | null
}
