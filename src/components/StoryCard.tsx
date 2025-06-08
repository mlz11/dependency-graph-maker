import { Group, Rect, Text } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { UserStory } from '../types/story'
import { useStoryStore } from '../stores/storyStore'
import { isPointerInsideCard } from '../utils/geometryUtils'

interface StoryCardProps {
  story: UserStory
  isSelected: boolean
  isDragged: boolean
  isHovered: boolean
  onSelect: () => void
  onDragEnd: (position: { x: number; y: number }) => void
  onDragMove?: (position: { x: number; y: number }) => void
}

const CARD_WIDTH = 200
const CARD_HEIGHT = 120

export const StoryCard = ({
  story,
  isSelected,
  isDragged,
  isHovered,
  onSelect,
  onDragEnd,
  onDragMove,
}: StoryCardProps) => {
  const {
    stories,
    setDraggedStory,
    setHoveredStory,
    createDependency,
    hoveredStoryId,
    setTempPosition,
  } = useStoryStore()
  const getStatusColor = (status: UserStory['status']) => {
    switch (status) {
      case 'todo':
        return '#e5e7eb'
      case 'in-progress':
        return '#fbbf24'
      case 'done':
        return '#10b981'
      default:
        return '#e5e7eb'
    }
  }

  const getBorderColor = () => {
    if (isDragged) return '#f59e0b' // Orange for being dragged
    if (isHovered) return '#10b981' // Green for hover target
    if (isSelected) return '#3b82f6' // Blue for selected
    return '#d1d5db' // Gray for default
  }

  const getBorderWidth = () => {
    if (isDragged || isHovered || isSelected) return 2
    return 1
  }

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    // Move card to top layer when dragging starts
    e.target.moveToTop()
    // Change cursor to grabbing
    const stage = e.target.getStage()
    if (stage) {
      stage.container().style.cursor = 'grabbing'
    }
    // Set this card as being dragged and clear any existing temp position
    setDraggedStory(story.id)
    setTempPosition(story.id, null)
  }

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    // Get pointer position relative to the stage
    const stage = e.target.getStage()
    if (!stage) return

    const pointerPosition = stage.getPointerPosition()
    if (!pointerPosition) return

    // Find any card that the pointer is inside
    let newHoveredStoryId: string | null = null

    for (const otherStory of stories) {
      // Skip self
      if (otherStory.id === story.id) continue

      const otherPosition = {
        x: otherStory.position.x,
        y: otherStory.position.y,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      }

      if (
        isPointerInsideCard(pointerPosition.x, pointerPosition.y, otherPosition)
      ) {
        newHoveredStoryId = otherStory.id
        break // Only one card can be hovered at a time
      }
    }

    // Update hovered state only if it changed
    setHoveredStory(newHoveredStoryId)

    // Update story position in real-time for arrow updates
    if (onDragMove) {
      onDragMove({
        x: e.target.x(),
        y: e.target.y(),
      })
    }
  }

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    // Reset cursor
    const stage = e.target.getStage()
    if (stage) {
      stage.container().style.cursor = 'grab'
    }

    // Check if card was dropped over another card (dependency creation)
    if (hoveredStoryId && hoveredStoryId !== story.id) {
      // Create dependency: dragged card depends on the hovered card
      createDependency(story.id, hoveredStoryId)
    }

    // Clear drag states and temp position
    setDraggedStory(null)
    setHoveredStory(null)
    setTempPosition(story.id, null)

    onDragEnd({
      x: e.target.x(),
      y: e.target.y(),
    })
  }

  const handleMouseEnter = (e: KonvaEventObject<MouseEvent>) => {
    // Change cursor to grab when hovering
    const stage = e.target.getStage()
    if (stage) {
      stage.container().style.cursor = 'grab'
    }
  }

  const handleMouseLeave = (e: KonvaEventObject<MouseEvent>) => {
    // Reset cursor when leaving card
    const stage = e.target.getStage()
    if (stage) {
      stage.container().style.cursor = 'default'
    }
  }

  return (
    <Group
      x={story.position.x}
      y={story.position.y}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      onTap={onSelect}
    >
      {/* Card background */}
      <Rect
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        fill="white"
        stroke={getBorderColor()}
        strokeWidth={getBorderWidth()}
        cornerRadius={8}
        shadowColor="black"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 2 }}
        shadowOpacity={0.1}
      />

      {/* Status indicator */}
      <Rect
        width={CARD_WIDTH}
        height={8}
        fill={getStatusColor(story.status)}
        cornerRadius={[8, 8, 0, 0]}
      />

      {/* Title */}
      <Text
        x={12}
        y={20}
        width={CARD_WIDTH - 24}
        text={story.title}
        fontSize={14}
        fontFamily="Arial"
        fill="#1f2937"
        wrap="word"
        ellipsis={true}
      />

      {/* Points badge */}
      {story.points && (
        <>
          <Rect
            x={CARD_WIDTH - 35}
            y={CARD_HEIGHT - 25}
            width={25}
            height={15}
            fill="#6b7280"
            cornerRadius={3}
          />
          <Text
            x={CARD_WIDTH - 30}
            y={CARD_HEIGHT - 22}
            text={story.points.toString()}
            fontSize={10}
            fontFamily="Arial"
            fill="white"
            align="center"
          />
        </>
      )}

      {/* Assignee */}
      {story.assignee && (
        <Text
          x={12}
          y={CARD_HEIGHT - 25}
          text={story.assignee}
          fontSize={10}
          fontFamily="Arial"
          fill="#6b7280"
        />
      )}
    </Group>
  )
}
