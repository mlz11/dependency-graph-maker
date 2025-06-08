# Visual Feedback for Drag-and-Drop Operations - TODO List

## Overview

Implementation of visual feedback system for drag-and-drop operations as specified in GitHub Issue #7.

### Goal

- When a card is being dragged, it should have a distinct border color to indicate active drag state
- When the dragged card hovers over another card, the target card should change its border color to indicate it's a potential drop target

## TODO Items

### Phase 1: Store Extensions for Drag State

- [ ] **Extend StoryState interface** in `src/stores/storyStore.ts`
  - Add `draggedStoryId: string | null` property
  - Add `hoveredStoryId: string | null` property
- [ ] **Add drag state actions** in `src/stores/storyStore.ts`
  - Implement `setDraggedStory(id: string | null)` action
  - Implement `setHoveredStory(id: string | null)` action

### Phase 2: Collision Detection Utilities

- [ ] **Create geometry utilities** in `src/utils/geometryUtils.ts`
  - Implement `isCardOverlapping()` function for collision detection
  - Calculate bounding box intersections between dragged and target cards
  - Return boolean indicating if cards overlap

### Phase 3: Enhanced StoryCard Component

- [ ] **Add drag state props** to StoryCard interface
  - Add `isDragged: boolean` prop
  - Add `isHovered: boolean` prop
- [ ] **Implement getBorderColor() logic** in StoryCard component
  - Orange border (`#f59e0b`) when card is being dragged
  - Green border (`#10b981`) when card is being hovered over
  - Maintain existing blue (`#3b82f6`) for selected state
  - Default gray (`#d1d5db`) for normal state
- [ ] **Enhanced drag event handlers** in StoryCard
  - Update `handleDragStart` to set dragged state in store
  - Implement `handleDragMove` to detect hover targets using collision detection
  - Update `handleDragEnd` to clear both dragged and hovered states
- [ ] **Update Rect component** to use dynamic border color
  - Replace static stroke logic with `getBorderColor()` function
  - Ensure proper border width for different states

### Phase 4: Canvas Integration

- [ ] **Update StoryCanvas component** in `src/components/StoryCanvas.tsx`
  - Access `draggedStoryId` and `hoveredStoryId` from store
  - Pass `isDragged` prop to each StoryCard component
  - Pass `isHovered` prop to each StoryCard component
- [ ] **Ensure proper cleanup** of drag states
  - Handle edge cases where drag operations are interrupted
  - Reset states on component unmount if necessary

### Phase 5: Testing & Validation

- [ ] **Manual testing scenarios**
  - Test dragging single card shows orange border
  - Test hovering over target card shows green border
  - Test moving away from target card resets border
  - Test dropping card resets all visual states
  - Test multiple card scenarios (only one can be hovered)
- [ ] **Edge case testing**
  - Test rapid drag movements
  - Test dragging outside canvas boundaries
  - Test interrupted drag operations
- [ ] **Performance validation**
  - Ensure smooth visual transitions
  - Verify no performance degradation with multiple cards

## Visual States Reference

| State         | Border Color       | Stroke Width | Priority |
| ------------- | ------------------ | ------------ | -------- |
| Being Dragged | `#f59e0b` (orange) | 2px          | Highest  |
| Hover Target  | `#10b981` (green)  | 2px          | High     |
| Selected      | `#3b82f6` (blue)   | 2px          | Medium   |
| Default       | `#d1d5db` (gray)   | 1px          | Lowest   |

## Success Criteria

- ✅ Dragged card shows orange border during drag
- ✅ Hovered card shows green border when dragged card is over it
- ✅ Only one card can be hovered at a time
- ✅ All visual states reset properly when drag ends
- ✅ Existing selection behavior remains unchanged
- ✅ Smooth visual transitions without performance issues

## Files to Modify/Create

1. **Modify**: `src/stores/storyStore.ts` - Add drag state management
2. **Modify**: `src/components/StoryCard.tsx` - Implement visual feedback and drag detection
3. **Modify**: `src/components/StoryCanvas.tsx` - Pass drag state props to cards
4. **Create**: `src/utils/geometryUtils.ts` - Collision detection utilities

## Notes

- This implementation focuses only on visual feedback, not dependency creation
- Maintains existing drag-and-drop functionality for positioning cards
- Sets foundation for future dependency creation features
- Follows existing codebase patterns and conventions
