import { Arrow as KonvaArrow } from 'react-konva'
import type { UserStory } from '../types/story'

interface ArrowProps {
  fromStory: UserStory
  toStory: UserStory
}

const CARD_WIDTH = 200
const CARD_HEIGHT = 120

export const Arrow = ({ fromStory, toStory }: ArrowProps) => {
  // Calculate card centers
  const fromCenterX = fromStory.position.x + CARD_WIDTH / 2
  const fromCenterY = fromStory.position.y + CARD_HEIGHT / 2
  const toCenterX = toStory.position.x + CARD_WIDTH / 2
  const toCenterY = toStory.position.y + CARD_HEIGHT / 2

  // Calculate direction vector
  const deltaX = toCenterX - fromCenterX
  const deltaY = toCenterY - fromCenterY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  if (distance === 0) return null // Avoid division by zero

  const unitX = deltaX / distance
  const unitY = deltaY / distance

  // Calculate intersection points with card rectangles
  // For the starting card (from), find exit point on card edge
  let startX, startY
  if (Math.abs(unitX) > Math.abs(unitY)) {
    // Arrow is more horizontal - exit from left/right edge
    startX = fromCenterX + (unitX > 0 ? CARD_WIDTH / 2 : -CARD_WIDTH / 2)
    startY = fromCenterY + (unitY * CARD_WIDTH) / 2 / Math.abs(unitX)
  } else {
    // Arrow is more vertical - exit from top/bottom edge
    startX = fromCenterX + (unitX * CARD_HEIGHT) / 2 / Math.abs(unitY)
    startY = fromCenterY + (unitY > 0 ? CARD_HEIGHT / 2 : -CARD_HEIGHT / 2)
  }

  // For the target card (to), find entry point on card edge with small margin for arrowhead
  let endX, endY
  const margin = 3 // Small margin to ensure arrowhead tip touches card edge
  if (Math.abs(unitX) > Math.abs(unitY)) {
    // Arrow is more horizontal - enter from left/right edge
    endX =
      toCenterX -
      (unitX > 0 ? CARD_WIDTH / 2 - margin : -(CARD_WIDTH / 2 - margin))
    endY = toCenterY - (unitY * (CARD_WIDTH / 2 - margin)) / Math.abs(unitX)
  } else {
    // Arrow is more vertical - enter from top/bottom edge
    endX = toCenterX - (unitX * (CARD_HEIGHT / 2 - margin)) / Math.abs(unitY)
    endY =
      toCenterY -
      (unitY > 0 ? CARD_HEIGHT / 2 - margin : -(CARD_HEIGHT / 2 - margin))
  }

  return (
    <KonvaArrow
      points={[startX, startY, endX, endY]}
      stroke="#6b7280"
      strokeWidth={2}
      fill="#6b7280"
      pointerLength={10}
      pointerWidth={10}
    />
  )
}
