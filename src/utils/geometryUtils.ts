export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export const isCardOverlapping = (
  draggedCard: BoundingBox,
  targetCard: BoundingBox
): boolean => {
  const draggedRight = draggedCard.x + draggedCard.width
  const draggedBottom = draggedCard.y + draggedCard.height
  const targetRight = targetCard.x + targetCard.width
  const targetBottom = targetCard.y + targetCard.height

  return !(
    draggedCard.x >= targetRight ||
    draggedRight <= targetCard.x ||
    draggedCard.y >= targetBottom ||
    draggedBottom <= targetCard.y
  )
}
