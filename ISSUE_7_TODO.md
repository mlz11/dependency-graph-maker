# Issue #7: Implement drag-and-drop dependency creation with visual feedback

## Overview

This implementation builds upon the existing visual feedback system to add actual dependency creation functionality. When cards are dropped over other cards, we need to create dependency relationships and update the visual layout.

## Requirements Analysis

### Visual Feedback (Already Implemented ✅)

- [x] Dragged card shows distinct border color (orange)
- [x] Hover target card shows different border color (green)
- [x] Visual feedback properly resets after drag operation

### New Requirements for Dependency Creation

- [ ] Detect when a card is dropped over another card
- [ ] Create dependency relationship in data store
- [ ] Implement hierarchical auto-layout algorithm
- [ ] Draw arrows between dependent cards
- [ ] Update visual layout after dependency creation

## Implementation Plan

### Phase 1: Data Model Extensions

- [ ] **Extend UserStory interface** in `src/types/story.ts`
  - Add `dependencies: string[]` property to track dependent story IDs
- [ ] **Extend StoryState interface** in `src/stores/storyStore.ts`
  - Add `createDependency(dependentId: string, dependsOnId: string)` action
  - Add `removeDependency(dependentId: string, dependsOnId: string)` action
  - Add `getDependencies()` getter for layout calculations

### Phase 2: Dependency Creation Logic

- [ ] **Update StoryCard component** drag handlers
  - Modify `handleDragEnd` to detect if card was dropped over another card
  - Call `createDependency` action when valid drop occurs
  - Ensure visual feedback is maintained during transition
- [ ] **Add dependency validation**
  - Prevent circular dependencies
  - Prevent duplicate dependencies
  - Handle edge cases (self-dependency, etc.)

### Phase 3: Hierarchical Layout Algorithm

- [ ] **Create layout utilities** in `src/utils/layoutUtils.ts`
  - Implement `calculateHierarchicalLayout(stories, dependencies)` function
  - Calculate positions based on dependency hierarchy
  - Handle multiple root nodes and complex dependency graphs
- [ ] **Update StoryCanvas component**
  - Trigger layout recalculation after dependency creation
  - Animate cards to new positions smoothly

### Phase 4: Arrow Rendering System

- [ ] **Create Arrow component** in `src/components/Arrow.tsx`
  - Render SVG arrows between cards
  - Calculate arrow paths based on card positions
  - Handle arrow styling and positioning
- [ ] **Update StoryCanvas component**
  - Render arrows for all dependencies
  - Update arrow positions when cards move
  - Layer arrows below cards for proper z-ordering

### Phase 5: Integration and Testing

- [ ] **Test dependency creation workflow**
  - Verify drag-and-drop creates dependencies correctly
  - Test hierarchical layout arrangement
  - Validate arrow rendering and positioning
- [ ] **Test edge cases**
  - Multiple dependencies per card
  - Complex dependency chains
  - Circular dependency prevention
- [ ] **Performance testing**
  - Large numbers of cards and dependencies
  - Smooth animations during layout changes

## Technical Considerations

### Layout Algorithm Approach

- Use directed acyclic graph (DAG) topological sorting
- Arrange cards in horizontal layers based on dependency depth
- Distribute cards within layers to minimize arrow crossings

### Arrow Rendering Strategy

- Use SVG for crisp arrow rendering at any zoom level
- Calculate control points for smooth curved arrows
- Update arrow paths when cards are dragged/repositioned

### Animation Strategy

- Use CSS transitions for smooth card position changes
- Stagger animations to avoid overwhelming visual changes
- Provide option to disable animations for accessibility

## Files to Modify/Create

1. **Modify**: `src/types/story.ts` - Add dependency fields
2. **Modify**: `src/stores/storyStore.ts` - Add dependency management actions
3. **Modify**: `src/components/StoryCard.tsx` - Enhanced drop detection
4. **Modify**: `src/components/StoryCanvas.tsx` - Layout orchestration
5. **Create**: `src/utils/layoutUtils.ts` - Hierarchical layout algorithms
6. **Create**: `src/components/Arrow.tsx` - Arrow rendering component

## Success Criteria

- ✅ Visual feedback system working (already implemented)
- ⏳ Cards can be dropped to create dependencies
- ⏳ Cards automatically rearrange in hierarchical layout
- ⏳ Arrows are drawn from dependency source to target
- ⏳ System handles complex dependency graphs gracefully
- ⏳ Performance remains smooth with multiple cards and dependencies

## Notes

- This builds on the existing visual feedback implementation from the previous task
- Focus on creating a solid foundation for dependency management
- Prioritize user experience with smooth animations and clear visual indicators
- Ensure the system remains performant as complexity grows
