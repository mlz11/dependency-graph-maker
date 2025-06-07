import { Group, Rect, Text } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { UserStory } from '../types/story'

interface StoryCardProps {
  story: UserStory
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (position: { x: number; y: number }) => void
}

const CARD_WIDTH = 200
const CARD_HEIGHT = 120

export const StoryCard = ({
  story,
  isSelected,
  onSelect,
  onDragEnd,
}: StoryCardProps) => {
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

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    // Move card to top layer when dragging starts
    e.target.moveToTop()
    // Change cursor to grabbing
    const stage = e.target.getStage()
    if (stage) {
      stage.container().style.cursor = 'grabbing'
    }
  }

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    // Reset cursor
    const stage = e.target.getStage()
    if (stage) {
      stage.container().style.cursor = 'grab'
    }

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
        stroke={isSelected ? '#3b82f6' : '#d1d5db'}
        strokeWidth={isSelected ? 2 : 1}
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
