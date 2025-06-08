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
