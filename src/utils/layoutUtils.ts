import type { UserStory } from '../types/story'

interface LayoutNode {
  story: UserStory
  level: number
  position: { x: number; y: number }
}

// Layout configuration
const LAYOUT_CONFIG = {
  HORIZONTAL_SPACING: 250, // Space between vertical columns
  VERTICAL_SPACING: 150, // Space between cards in same column
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
 * Calculate positions for each story in hierarchical layout
 */
function calculatePositions(levels: LayoutNode[][]): LayoutNode[] {
  const result: LayoutNode[] = []

  levels.forEach((level, levelIndex) => {
    const x =
      LAYOUT_CONFIG.START_X + levelIndex * LAYOUT_CONFIG.HORIZONTAL_SPACING

    // Center the cards vertically within the level
    const totalHeight =
      level.length * LAYOUT_CONFIG.CARD_HEIGHT +
      (level.length - 1) * LAYOUT_CONFIG.VERTICAL_SPACING
    const startY =
      LAYOUT_CONFIG.START_Y + (level.length > 1 ? 0 : totalHeight / 4)

    level.forEach((node, nodeIndex) => {
      const y =
        startY +
        nodeIndex * (LAYOUT_CONFIG.CARD_HEIGHT + LAYOUT_CONFIG.VERTICAL_SPACING)

      result.push({
        ...node,
        position: { x, y },
      })
    })
  })

  return result
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
