import dagre from '@dagrejs/dagre'
import type { UserStory } from '../types/story'

const NODE_WIDTH = 200
const NODE_HEIGHT = 120
const RANK_SEPARATION = 150
const NODE_SEPARATION = 50

export interface LayoutNode {
  id: string
  x: number
  y: number
}

export const calculateHierarchicalLayout = (
  stories: UserStory[]
): LayoutNode[] => {
  const g = new dagre.graphlib.Graph()

  // Configure the layout
  g.setGraph({
    rankdir: 'TB', // Top to bottom
    ranksep: RANK_SEPARATION,
    nodesep: NODE_SEPARATION,
    edgesep: 10,
    marginx: 50,
    marginy: 50,
  })

  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes
  stories.forEach((story) => {
    g.setNode(story.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })
  })

  // Add edges (dependencies)
  stories.forEach((story) => {
    if (story.dependencies && story.dependencies.length > 0) {
      story.dependencies.forEach((depId) => {
        // Edge from dependency to dependent (depId -> story.id)
        g.setEdge(depId, story.id)
      })
    }
  })

  // Calculate layout
  dagre.layout(g)

  // Extract positions
  const layoutNodes: LayoutNode[] = []

  stories.forEach((story) => {
    const node = g.node(story.id)
    if (node) {
      layoutNodes.push({
        id: story.id,
        x: node.x - NODE_WIDTH / 2, // Dagre returns center positions
        y: node.y - NODE_HEIGHT / 2,
      })
    }
  })

  return layoutNodes
}

export const hasCircularDependency = (stories: UserStory[]): boolean => {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  const hasCycle = (storyId: string): boolean => {
    if (recursionStack.has(storyId)) {
      return true // Found a cycle
    }

    if (visited.has(storyId)) {
      return false // Already processed
    }

    visited.add(storyId)
    recursionStack.add(storyId)

    const story = stories.find((s) => s.id === storyId)
    if (story?.dependencies) {
      for (const depId of story.dependencies) {
        if (hasCycle(depId)) {
          return true
        }
      }
    }

    recursionStack.delete(storyId)
    return false
  }

  // Check all stories for cycles
  for (const story of stories) {
    if (!visited.has(story.id)) {
      if (hasCycle(story.id)) {
        return true
      }
    }
  }

  return false
}
