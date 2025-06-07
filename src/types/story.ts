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
}