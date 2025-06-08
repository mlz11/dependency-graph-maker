import { useRef, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useStoryStore } from '../stores/storyStore'
import { StoryCard } from './StoryCard'
import { Arrow } from './Arrow'
import type { UserStory } from '../types/story'

interface StoryCanvasProps {
  width: number
  height: number
}

export const StoryCanvas = ({ width, height }: StoryCanvasProps) => {
  const stageRef = useRef(null)

  const {
    stories,
    selectedStoryId,
    draggedStoryId,
    hoveredStoryId,
    tempPositions,
    selectStory,
    updateStoryPosition,
    setTempPosition,
    getDependencies,
  } = useStoryStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectStory(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectStory])

  const handleStageClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // If clicked on empty area, deselect
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectStory(null)
    }
  }

  // Get dependencies and create arrow data with real-time positions
  const dependencies = getDependencies()
  const arrows = dependencies
    .map(({ from, to }) => {
      const fromStory = stories.find((s) => s.id === from)
      const toStory = stories.find((s) => s.id === to)

      if (!fromStory || !toStory) return null

      // Use temp positions if available, otherwise use story positions
      const fromPosition = tempPositions[from] || fromStory.position
      const toPosition = tempPositions[to] || toStory.position

      return {
        fromStory: { ...fromStory, position: fromPosition },
        toStory: { ...toStory, position: toPosition },
      }
    })
    .filter(Boolean) as Array<{ fromStory: UserStory; toStory: UserStory }>

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={handleStageClick}
      onTouchStart={handleStageClick}
      draggable
      style={{ border: '1px solid #e5e7eb' }}
    >
      {/* Arrow layer (rendered below cards) */}
      <Layer>
        {arrows.map(({ fromStory, toStory }, index) => (
          <Arrow
            key={`${fromStory.id}-${toStory.id}-${index}`}
            fromStory={fromStory}
            toStory={toStory}
          />
        ))}
      </Layer>

      {/* Card layer (rendered above arrows) */}
      <Layer>
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            isSelected={selectedStoryId === story.id}
            isDragged={draggedStoryId === story.id}
            isHovered={hoveredStoryId === story.id}
            onSelect={() => selectStory(story.id)}
            onDragEnd={(position) => {
              setTempPosition(story.id, null) // Clear temp position
              updateStoryPosition(story.id, position)
            }}
            onDragMove={(position) => setTempPosition(story.id, position)}
          />
        ))}
      </Layer>
    </Stage>
  )
}
