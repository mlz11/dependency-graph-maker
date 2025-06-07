import { useRef, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useStoryStore } from '../stores/storyStore'
import { StoryCard } from './StoryCard'
import { DependencyArrow } from './DependencyArrow'

interface StoryCanvasProps {
  width: number
  height: number
}

export const StoryCanvas = ({ width, height }: StoryCanvasProps) => {
  const stageRef = useRef(null)

  const {
    stories,
    selectedStoryId,
    dragState,
    selectStory,
    updateStoryPosition,
    addDependency,
    arrangeHierarchically,
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

  // Generate dependency arrows
  const dependencyArrows = stories.flatMap((story) => {
    if (!story.dependencies) return []

    return story.dependencies
      .map((depId) => {
        const dependencyStory = stories.find((s) => s.id === depId)
        if (!dependencyStory) return null

        return (
          <DependencyArrow
            key={`${depId}-${story.id}`}
            fromStory={dependencyStory}
            toStory={story}
          />
        )
      })
      .filter(Boolean)
  })

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
      <Layer>
        {/* Render arrows first (behind cards) */}
        {dependencyArrows}
        {/* Render story cards on top */}
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            isSelected={selectedStoryId === story.id}
            onSelect={() => selectStory(story.id)}
            onDragEnd={(position) => {
              // Check if dropped over another card
              if (dragState.hoverTargetId && dragState.draggedStoryId) {
                // Create dependency: draggedStory depends on hoverTarget
                addDependency(dragState.draggedStoryId, dragState.hoverTargetId)
                // Arrange all cards hierarchically after creating dependency
                setTimeout(() => arrangeHierarchically(), 100)
              } else {
                // Normal position update if not dropped over another card
                updateStoryPosition(story.id, position)
              }
            }}
          />
        ))}
      </Layer>
    </Stage>
  )
}
