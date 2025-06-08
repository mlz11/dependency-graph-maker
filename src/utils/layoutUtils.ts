import type { UserStory } from '../types/story'

interface LayoutNode {
  story: UserStory
  level: number
  position: { x: number; y: number }
}

// Layout configuration
const LAYOUT_CONFIG = {
  HORIZONTAL_SPACING: 250, // Space between cards in same row
  VERTICAL_SPACING: 150, // Space between rows (levels)
  START_X: 100, // Left margin
  START_Y: 100, // Top margin
  CARD_WIDTH: 200,
  CARD_HEIGHT: 120,
}

/**
 * Performs topological sort on stories based on their dependencies
 * Returns stories grouped by dependency level (0 = no dependencies, 1 = depends on level 0, etc.)
 */
function topologicalSort(stories: UserStory[]): LayoutNode[][] {
  // Create a map for quick story lookup
  const storyMap = new Map(stories.map((story) => [story.id, story]))

  // Track in-degree (number of dependencies) for each story
  const inDegree = new Map<string, number>()
  const adjList = new Map<string, string[]>() // adjacency list for dependents

  // Initialize in-degree and adjacency list
  stories.forEach((story) => {
    inDegree.set(story.id, (story.dependencies || []).length)
    adjList.set(story.id, [])
  })

  // Build adjacency list (reverse of dependencies)
  stories.forEach((story) => {
    ;(story.dependencies || []).forEach((depId) => {
      if (adjList.has(depId)) {
        adjList.get(depId)!.push(story.id)
      }
    })
  })

  // Perform topological sort using Kahn's algorithm
  const levels: LayoutNode[][] = []
  const queue: string[] = []
  const processedLevels = new Map<string, number>()

  // Start with stories that have no dependencies
  stories.forEach((story) => {
    if (inDegree.get(story.id) === 0) {
      queue.push(story.id)
      processedLevels.set(story.id, 0)
    }
  })

  while (queue.length > 0) {
    const currentLevelSize = queue.length
    const currentLevel: LayoutNode[] = []

    // Process all nodes at current level
    for (let i = 0; i < currentLevelSize; i++) {
      const storyId = queue.shift()!
      const story = storyMap.get(storyId)!
      const level = processedLevels.get(storyId)!

      currentLevel.push({
        story,
        level,
        position: { x: 0, y: 0 }, // Will be calculated later
      })

      // Process dependents
      adjList.get(storyId)!.forEach((dependentId) => {
        const newInDegree = inDegree.get(dependentId)! - 1
        inDegree.set(dependentId, newInDegree)

        if (newInDegree === 0) {
          queue.push(dependentId)
          processedLevels.set(dependentId, level + 1)
        }
      })
    }

    if (currentLevel.length > 0) {
      levels.push(currentLevel)
    }
  }

  return levels
}

/**
 * Calculate positions for each story in tree-like hierarchical layout
 */
function calculatePositions(levels: LayoutNode[][]): LayoutNode[] {
  const result: LayoutNode[] = []
  const storyMap = new Map<string, LayoutNode>()

  // First pass: assign Y positions based on levels
  levels.forEach((level, levelIndex) => {
    const y =
      LAYOUT_CONFIG.START_Y + levelIndex * LAYOUT_CONFIG.VERTICAL_SPACING

    level.forEach((node) => {
      const nodeWithY = { ...node, position: { x: 0, y } }
      storyMap.set(node.story.id, nodeWithY)
    })
  })

  // Second pass: calculate X positions based on tree structure
  const canvasWidth = 1200 // Assume canvas width
  const processedNodes = new Set<string>()

  // Start with root nodes (level 0) and position them
  if (levels.length > 0) {
    const rootLevel = levels[0]
    const rootSpacing = Math.max(300, canvasWidth / (rootLevel.length + 1))

    rootLevel.forEach((node, index) => {
      const x = (index + 1) * rootSpacing - LAYOUT_CONFIG.CARD_WIDTH / 2
      const updatedNode = { ...node, position: { x, y: node.position.y } }
      storyMap.set(node.story.id, updatedNode)
      result.push(updatedNode)
      processedNodes.add(node.story.id)

      // Position children under this parent
      positionChildren(
        node.story.id,
        x,
        levels,
        storyMap,
        processedNodes,
        result
      )
    })
  }

  return result
}

/**
 * Recursively position children under their parent
 */
function positionChildren(
  parentId: string,
  parentX: number,
  levels: LayoutNode[][],
  storyMap: Map<string, LayoutNode>,
  processedNodes: Set<string>,
  result: LayoutNode[]
): void {
  // Find all children of this parent
  const children: LayoutNode[] = []

  levels.forEach((level) => {
    level.forEach((node) => {
      if (
        !processedNodes.has(node.story.id) &&
        (node.story.dependencies || []).includes(parentId)
      ) {
        children.push(node)
      }
    })
  })

  if (children.length === 0) return

  // Position children horizontally centered under parent
  const childSpacing = Math.max(LAYOUT_CONFIG.HORIZONTAL_SPACING, 250)
  const totalChildWidth = (children.length - 1) * childSpacing
  const startX = parentX - totalChildWidth / 2

  children.forEach((child, index) => {
    const x = startX + index * childSpacing
    const existingNode = storyMap.get(child.story.id)!
    const updatedNode = {
      ...child,
      position: { x, y: existingNode.position.y },
    }

    storyMap.set(child.story.id, updatedNode)
    result.push(updatedNode)
    processedNodes.add(child.story.id)

    // Recursively position grandchildren
    positionChildren(
      child.story.id,
      x,
      levels,
      storyMap,
      processedNodes,
      result
    )
  })
}

/**
 * Main function to calculate hierarchical layout for all stories
 * Returns a map of story ID to new position
 */
export function calculateHierarchicalLayout(
  stories: UserStory[]
): Map<string, { x: number; y: number }> {
  if (stories.length === 0) {
    return new Map()
  }

  // Perform topological sort
  const levels = topologicalSort(stories)

  // Calculate positions
  const layoutNodes = calculatePositions(levels)

  // Create position map
  const positionMap = new Map<string, { x: number; y: number }>()
  layoutNodes.forEach((node) => {
    positionMap.set(node.story.id, node.position)
  })

  return positionMap
}

/**
 * Animate stories to their new positions smoothly
 */
export function animateToPositions(
  stories: UserStory[],
  newPositions: Map<string, { x: number; y: number }>,
  updatePosition: (id: string, position: { x: number; y: number }) => void,
  duration: number = 800
): void {
  const startTime = Date.now()
  const initialPositions = new Map(
    stories.map((story) => [story.id, { ...story.position }])
  )

  function animate() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-in-out)
    const easeInOut = (t: number) => t * t * (3 - 2 * t)
    const easedProgress = easeInOut(progress)

    stories.forEach((story) => {
      const startPos = initialPositions.get(story.id)!
      const endPos = newPositions.get(story.id)

      if (endPos) {
        const currentX = startPos.x + (endPos.x - startPos.x) * easedProgress
        const currentY = startPos.y + (endPos.y - startPos.y) * easedProgress

        updatePosition(story.id, { x: currentX, y: currentY })
      }
    })

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}
