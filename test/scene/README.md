# Scene Video Effects Tests

This directory contains comprehensive tests for video scene functionality in FFCreatorLite. The tests verify that video scenes with various effects can be created and rendered successfully.

## Test Files

### `basic-scene.test.js`
Tests fundamental scene creation functionality:
- Basic scene with video
- Scene with video and text  
- Video with fade effects
- Video with movement effects
- Scene and video property validation

### `advanced-effects.test.js`
Tests complex video effects and compositions:
- Multiple sequential effects on single video
- Custom animation sequences
- Multiple video compositions with synchronized effects
- Video with animated text overlays
- Scene transitions
- Video clipping and timing
- Error handling for invalid inputs

### `video-effects.test.js`
Comprehensive tests for all video effects:
- Fade effects (fadeIn, fadeOut)
- Movement effects (moveInLeft, moveInRight, moveInUp, moveInDown)
- Zoom effects (zoomIn, zoomOut) 
- Rotation effects (rotateIn, rotateOut)
- Multiple videos with different effects
- Video property validation

### `utils/test-utils.js`
Utility functions for testing:
- Video rendering and validation
- Video property inspection (duration, dimensions, frame rate)
- File system operations
- Mock video creation
- Test cleanup

## Running Tests

To run all scene tests:
```bash
npm test -- test/scene/
```

To run specific test files:
```bash
npm test -- test/scene/basic-scene.test.js
npm test -- test/scene/advanced-effects.test.js
npm test -- test/scene/video-effects.test.js
```

## Test Structure

Each test follows this pattern:
1. **Setup**: Create FFCreator instance, scene, and configure test environment
2. **Create Components**: Add video, text, and other elements to scene
3. **Add Effects**: Apply animation effects to components
4. **Render**: Start video rendering process
5. **Validate**: Check that output video was created successfully
6. **Cleanup**: Remove temporary files and destroy instances

## Video Effects Available

The tests verify these effects work correctly:

### Fade Effects
- `fadeIn` - Gradually appear
- `fadeOut` - Gradually disappear

### Movement Effects  
- `moveInLeft` - Move in from left
- `moveInRight` - Move in from right
- `moveInUp` - Move in from top
- `moveInDown` - Move in from bottom

### Zoom Effects
- `zoomIn` - Zoom in effect
- `zoomOut` - Zoom out effect
- `zoomNopadIn` - Zoom without padding
- `zoomNopadOut` - Zoom out without padding

### Rotation Effects
- `rotateIn` - Rotate in effect
- `rotateOut` - Rotate out effect
- `rotateInBig` - Big rotation in
- `rotateOutBig` - Big rotation out

### Custom Animations
Custom animations can be created with:
```javascript
video.addAnimate({
  type: 'move',
  showType: 'in',
  time: 2,
  delay: 1,
  from: { x: 0, y: 0 },
  to: { x: 200, y: 150 },
  ease: 'quadOut'
});
```

## Test Data

Tests use video files from `examples/assets/video/` directory. If these files don't exist, tests will be skipped with a warning message.

## Test Utilities

The `TestUtils` class provides:
- `renderAndValidate()` - Render video and validate output
- `videoExists()` - Check if video file exists and is valid
- `getVideoDuration()` - Get video duration using ffprobe
- `getVideoDimensions()` - Get video width/height
- `getVideoFrameRate()` - Get video FPS
- `validateVideoProperties()` - Validate video against expected properties
- `cleanupDirectories()` - Clean up test directories
- `createMockVideo()` - Create test video files

## Configuration

Tests are configured with:
- Short durations for faster test execution
- Disabled logging to reduce test noise
- Automatic cleanup of temporary files
- Timeout handling for video rendering
- Graceful error handling for missing assets

## Adding New Tests

To add new scene tests:
1. Create test file in `test/scene/`
2. Follow naming convention: `*.test.js`
3. Import required modules and TestUtils
4. Set up proper beforeEach/afterEach hooks
5. Include cleanup in afterAll hook
6. Use descriptive test names and organize into logical groups
7. Handle missing test assets gracefully

## Dependencies

Scene tests require:
- `fs-extra` - File system operations
- `ffmpeg-probe` - Video property inspection
- `fluent-ffmpeg` - Video processing
- FFCreatorLite components (FFCreator, FFScene, FFVideo, FFText, etc.)

The tests are designed to be self-contained and not interfere with each other. 