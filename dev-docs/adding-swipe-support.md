# Plan: Add Touch Swipe Gesture Support to nextpage-we

## Overview
Add **horizontal touch swipe gesture (left/right)** support to the Firefox extension's page script to enable navigation between pages on touch devices.

**User Choices:**
- Horizontal swipes only (left/right for previous/next page)
- Fixed threshold of 50px (not user-configurable)
- Allow default scrolling during swipe detection (no preventDefault)

## Files to Modify
- `src/nextpage.js` - Main content script with all event handling logic

## Implementation Plan

### 1. Add Touch Event Notation Helper Function (~line 422)
Add a new function to `utils` object to describe swipe gestures in emacs notation:

```javascript
/**
 * describe swipe gesture in emacs notation. return a string.
 * example: <swipe-left>, <swipe-right>
 */
describeSwipeInEmacsNotation: function (direction) {
    const swipe = "swipe-" + direction;
    return '<' + swipe + '>';
}
```

**Location**: After `describeWheelEventInEmacsNotation` (around line 422)

### 2. Add Swipe Detection Logic (~line 1638, before `bindings`)
Add state variables and swipe detection functions before the `bindings` object:

```javascript
// Touch swipe detection state
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 50; // Minimum distance for swipe
```

Then add the swipe detection handler after the event handler builders (around line 1817).

### 3. Add Touch Event Listeners (~line 1839, after wheel event listener)
Add three event listeners for touch events:

```javascript
// Touch event handling for swipe gestures
document.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
});

// No touchmove listener needed - we allow default scrolling

document.addEventListener("touchend", function (e) {
    if (e.changedTouches.length !== 1) {
        return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Detect horizontal swipe (ignore vertical swipes)
    if (Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > SWIPE_THRESHOLD) {
        const direction = deltaX > 0 ? "right" : "left";
        const key = utils.describeSwipeInEmacsNotation(direction);

        if (debugKeyEvents()) {
            log("swipe detected: " + key);
        }

        if (skipWebsite(e) || shouldIgnoreKey(key)) {
            return;
        }

        let command = getBindings()[key];
        if (typeof(command) !== "undefined") {
            runUserCommand(command);
        }
    }
});
```

**Location**: After the wheel event listener (around line 1839)

### 4. Add Default Swipe Bindings (~line 1640)
Update the `bindings` object to include swipe gestures:

```javascript
let bindings = {
    "n": "nextpage",
    "p": "history-back",
    "SPC": "nextpage-maybe",
    "<swipe-left>": "previous-page",
    "<swipe-right>": "nextpage"
};
```

**Location**: Replace existing `bindings` object (lines 1640-1644)

### 5. Swipe Threshold (Fixed)
Using a fixed threshold of 50px - no user configuration needed. This is a reasonable default that works well for most touch devices.

## Verification

### Testing Steps
1. **Load the extension** in Firefox with the modified code
2. **Navigate to a test page** with pagination (e.g., a forum or blog)
3. **Test swipe gestures on a touch device** or browser devtools:
   - Swipe left → should go to previous page
   - Swipe right → should go to next page
4. **Test edge cases**:
   - Verify swipes don't trigger when typing in input fields (should be handled by existing filters)
   - Verify swipes respect website ignore list
   - Verify vertical swipes don't trigger horizontal navigation
   - Verify short touches don't trigger navigation

### Browser DevTools Testing
- Use Firefox DevTools → Responsive Design Mode
- Enable touch simulation
- Test swipe gestures with the device simulator

### Debug Output
Enable `debugKeyEvents` in the extension settings to see console output:
```
swipe detected: <swipe-left>
will process key: <swipe-left>
runUserCommand: previous-page
```

## Implementation Notes

### Why This Approach
1. **Follows existing patterns**: Uses same structure as keydown, wheel, and mouse event handlers
2. **Minimal changes**: Only adds new code without modifying existing logic
3. **Consistent notation**: Uses emacs-style bracket notation like `<swipe-left>`
4. **User-configurable**: Users can rebind swipe gestures via existing binding system

### Swipe Detection Logic
- Tracks touch start position on `touchstart`
- Detects swipe direction on `touchend`
- Uses fixed 50px threshold to distinguish intentional swipes from accidental touches
- Prioritizes horizontal over vertical swipes (deltaX vs deltaY comparison)
- Allows default scrolling (no preventDefault on touchmove)

### Potential Enhancements (Out of Scope)
- Add vertical swipe support for scroll-up/scroll-down commands
- Add user-configurable swipe threshold
- Add velocity-based detection (faster swipes could have different behavior)
- Add support for pinch-to-zoom gestures
- Add visual feedback during swipe gesture
