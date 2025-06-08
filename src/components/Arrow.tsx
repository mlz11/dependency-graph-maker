import { Arrow as KonvaArrow } from 'react-konva'
import type { UserStory } from '../types/story'

interface ArrowProps {
  fromStory: UserStory
  toStory: UserStory
}

const CARD_WIDTH = 200
const CARD_HEIGHT = 120

export const Arrow = ({ fromStory, toStory }: ArrowProps) => {
  // Calculate connection points on card edges
  const fromX = fromStory.position.x + CARD_WIDTH / 2
  const fromY = fromStory.position.y + CARD_HEIGHT / 2
  const toX = toStory.position.x + CARD_WIDTH / 2
  const toY = toStory.position.y + CARD_HEIGHT / 2

  // Calculate direction and adjust connection points to card edges
  const deltaX = toX - fromX
  const deltaY = toY - fromY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  if (distance === 0) return null // Avoid division by zero

  const unitX = deltaX / distance
  const unitY = deltaY / distance

  // Offset from card centers to edges
  const startX = fromX + unitX * (CARD_WIDTH / 2)
  const startY = fromY + unitY * (CARD_HEIGHT / 2)
  const endX = toX - unitX * (CARD_WIDTH / 2)
  const endY = toY - unitY * (CARD_HEIGHT / 2)

  return (
    <KonvaArrow
      points={[startX, startY, endX, endY]}
      stroke="#6b7280"
      strokeWidth={2}
      fill="#6b7280"
      pointerLength={8}
      pointerWidth={8}
    />
  )
}
