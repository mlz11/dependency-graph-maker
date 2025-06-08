export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export const isPointerInsideCard = (
  pointerX: number,
  pointerY: number,
  targetCard: BoundingBox
): boolean => {
  return (
    pointerX >= targetCard.x &&
    pointerX <= targetCard.x + targetCard.width &&
    pointerY >= targetCard.y &&
    pointerY <= targetCard.y + targetCard.height
  )
}
