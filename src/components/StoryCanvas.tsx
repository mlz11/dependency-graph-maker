import { useRef, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import { useStoryStore } from '../stores/storyStore'
import { StoryCard } from './StoryCard'

interface StoryCanvasProps {
  width: number
  height: number
}

export const StoryCanvas = ({ width, height }: StoryCanvasProps) => {
  const stageRef = useRef(null)

  const { stories, selectedStoryId, selectStory, updateStoryPosition } =
    useStoryStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectStory(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectStory])

  const handleStageClick = (e: any) => {
    // If clicked on empty area, deselect
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectStory(null)
    }
  }

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
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            isSelected={selectedStoryId === story.id}
            onSelect={() => selectStory(story.id)}
            onDragEnd={(position) => updateStoryPosition(story.id, position)}
          />
        ))}
      </Layer>
    </Stage>
  )
}
