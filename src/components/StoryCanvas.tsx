import { useRef, useEffect, useState } from 'react'
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

  // Zoom state management
  const [scale, setScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })

  // Zoom configuration
  const ZOOM_MIN = 0.1
  const ZOOM_MAX = 3.0
  const ZOOM_STEP = 0.025

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

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const stage = e.target.getStage()
    if (!stage) return

    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    // Calculate new scale
    const direction = e.evt.deltaY > 0 ? -1 : 1
    const newScale = Math.max(
      ZOOM_MIN,
      Math.min(ZOOM_MAX, oldScale + direction * ZOOM_STEP)
    )

    // Calculate new position to zoom towards cursor
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }

    setScale(newScale)
    setStagePos(newPos)
  }

  const zoomIn = () => {
    const newScale = Math.min(ZOOM_MAX, scale + ZOOM_STEP)
    setScale(newScale)
  }

  const zoomOut = () => {
    const newScale = Math.max(ZOOM_MIN, scale - ZOOM_STEP)
    setScale(newScale)
  }

  const resetZoom = () => {
    setScale(1)
    setStagePos({ x: 0, y: 0 })
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
    <div style={{ position: 'relative' }}>
      {/* Zoom Controls */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '4px',
        }}
      >
        <button
          onClick={zoomIn}
          disabled={scale >= ZOOM_MAX}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #d1d5db',
            background: scale >= ZOOM_MAX ? '#f3f4f6' : 'white',
            borderRadius: '4px',
            cursor: scale >= ZOOM_MAX ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#374151',
          }}
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          disabled={scale <= ZOOM_MIN}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #d1d5db',
            background: scale <= ZOOM_MIN ? '#f3f4f6' : 'white',
            borderRadius: '4px',
            cursor: scale <= ZOOM_MIN ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#374151',
          }}
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={resetZoom}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #d1d5db',
            background: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '8px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#374151',
          }}
          title="Reset Zoom (100%)"
        >
          100%
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        {Math.round(scale * 100)}%
      </div>

      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={stagePos.x}
        y={stagePos.y}
        onMouseDown={handleStageClick}
        onTouchStart={handleStageClick}
        onWheel={handleWheel}
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
    </div>
  )
}
