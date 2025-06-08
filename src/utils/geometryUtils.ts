export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface StageTransform {
  x: number
  y: number
  scaleX: number
  scaleY: number
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

export const isPointerInsideCardWithTransform = (
  stagePointerX: number,
  stagePointerY: number,
  targetCard: BoundingBox,
  stageTransform: StageTransform
): boolean => {
  // Convert stage pointer coordinates to world coordinates
  const worldX = (stagePointerX - stageTransform.x) / stageTransform.scaleX
  const worldY = (stagePointerY - stageTransform.y) / stageTransform.scaleY

  return (
    worldX >= targetCard.x &&
    worldX <= targetCard.x + targetCard.width &&
    worldY >= targetCard.y &&
    worldY <= targetCard.y + targetCard.height
  )
}
