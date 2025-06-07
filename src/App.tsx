import { useEffect, useState } from 'react'
import { StoryCanvas } from './components/StoryCanvas'
import { useStoryStore } from './stores/storyStore'
import './App.css'

function App() {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const { addStory, stories } = useStoryStore()

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: Math.min(window.innerWidth - 40, 1200),
        height: Math.min(window.innerHeight - 150, 800)
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleAddSampleStory = () => {
    addStory({
      title: `Sample Story ${stories.length + 1}`,
      description: 'This is a sample user story',
      status: 'todo',
      assignee: 'John Doe',
      points: Math.floor(Math.random() * 8) + 1,
      position: {
        x: Math.random() * (canvasSize.width - 200),
        y: Math.random() * (canvasSize.height - 120)
      }
    })
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Dependency Graph Maker</h1>
        <button 
          onClick={handleAddSampleStory}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Sample Story
        </button>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>
          Stories: {stories.length}
        </span>
      </div>
      
      <StoryCanvas width={canvasSize.width} height={canvasSize.height} />
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
        <p>• Click and drag stories to move them around</p>
        <p>• Click on a story to select it (press Escape to deselect)</p>
        <p>• Drag the canvas background to pan around</p>
      </div>
    </div>
  )
}

export default App
