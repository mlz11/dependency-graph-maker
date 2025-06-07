import { Arrow } from 'react-konva'
import type { UserStory } from '../types/story'

interface DependencyArrowProps {
  fromStory: UserStory
  toStory: UserStory
}

const CARD_WIDTH = 200
const CARD_HEIGHT = 120

export const DependencyArrow = ({
  fromStory,
  toStory,
}: DependencyArrowProps) => {
  // Calculate arrow start and end points
  const fromCenterX = fromStory.position.x + CARD_WIDTH / 2
  const fromCenterY = fromStory.position.y + CARD_HEIGHT / 2
  const toCenterX = toStory.position.x + CARD_WIDTH / 2
  const toCenterY = toStory.position.y + CARD_HEIGHT / 2

  // Calculate direction vector
  const dx = toCenterX - fromCenterX
  const dy = toCenterY - fromCenterY
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance === 0) return null

  // Normalize direction
  const unitX = dx / distance
  const unitY = dy / distance

  // Calculate edge points on card boundaries
  const fromX = fromCenterX + unitX * (CARD_WIDTH / 2)
  const fromY = fromCenterY + unitY * (CARD_HEIGHT / 2)
  const toX = toCenterX - unitX * (CARD_WIDTH / 2)
  const toY = toCenterY - unitY * (CARD_HEIGHT / 2)

  return (
    <Arrow
      points={[fromX, fromY, toX, toY]}
      pointerLength={10}
      pointerWidth={8}
      fill="#6b7280"
      stroke="#6b7280"
      strokeWidth={2}
      tension={0}
      shadowColor="black"
      shadowBlur={2}
      shadowOffset={{ x: 1, y: 1 }}
      shadowOpacity={0.2}
    />
  )
}
