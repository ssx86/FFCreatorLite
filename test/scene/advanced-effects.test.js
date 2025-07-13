const path = require('path');
const fs = require('fs-extra');
const { FFCreator, FFScene, FFVideo, FFImage, FFText } = require('../../lib/index');

describe('Advanced Video Effects Tests', () => {
  let creator;
  let scene;
  let outputDir;
  let cacheDir;

  beforeAll(async () => {
    outputDir = path.join(__dirname, './output/');
    cacheDir = path.join(__dirname, './cache/');

    await fs.ensureDir(outputDir);
    await fs.ensureDir(cacheDir);
  });

  beforeEach(() => {
    creator = new FFCreator({
      cacheDir,
      outputDir,
      width: 800,
      height: 600,
      log: false,
      fps: 25,
    });

    scene = new FFScene();
    scene.setDuration(6);
  });

  afterEach(async () => {
    if (creator) {
      creator.destroy();
    }
  });

  afterAll(async () => {
    try {
      await fs.remove(outputDir);
      await fs.remove(cacheDir);
    } catch (error) {
      console.warn('Warning: Could not clean up test directories:', error.message);
    }
  });

  describe('Complex Animation Sequences', () => {
    test('should create video with multiple sequential effects', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found');
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 200,
        y: 150,
        width: 400,
        height: 300,
        duration: 6,
        appearTime: 0,
      });

      // Add multiple effects in sequence
      video.addEffect('fadeIn', 1, 0);
      video.addEffect('zoomIn', 2, 1);
      video.addEffect('fadeOut', 1, 5);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });

    test('should create video with custom animation', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found');
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 5,
        appearTime: 0,
      });

      // Add custom animation
      video.addAnimate({
        type: 'move',
        showType: 'in',
        time: 2,
        delay: 1,
        from: { x: 0, y: 0 },
        to: { x: 200, y: 150 },
        ease: 'quadOut',
      });

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });
  });

  describe('Multiple Video Composition', () => {
    test('should create scene with multiple videos and synchronized effects', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found');
        return;
      }

      // First video - left side
      const video1 = new FFVideo({
        path: videoPath,
        x: 50,
        y: 100,
        width: 300,
        height: 200,
        duration: 4,
        appearTime: 0,
      });
      video1.addEffect('moveInLeft', 1.5, 0);

      // Second video - right side
      const video2 = new FFVideo({
        path: videoPath,
        x: 400,
        y: 100,
        width: 300,
        height: 200,
        duration: 4,
        appearTime: 1,
      });
      video2.addEffect('moveInRight', 1.5, 0);

      // Third video - center, appears later
      const video3 = new FFVideo({
        path: videoPath,
        x: 225,
        y: 350,
        width: 300,
        height: 200,
        duration: 3,
        appearTime: 2,
      });
      video3.addEffect('zoomIn', 1, 0);

      scene.addChild(video1);
      scene.addChild(video2);
      scene.addChild(video3);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });
  });

  describe('Video with Text Overlay Effects', () => {
    test('should create video with animated text overlay', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found');
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 600,
        height: 400,
        duration: 6,
        appearTime: 0,
      });
      video.addEffect('fadeIn', 1, 0);

      const title = new FFText({
        text: 'Advanced Video Effects',
        x: 400,
        y: 80,
        fontSize: 36,
        duration: 5,
        appearTime: 1,
      });
      title.setColor('#ffffff');
      title.setBorder(2, '#000000');
      title.addEffect('moveInLeft', 1.5, 0);

      const subtitle = new FFText({
        text: 'Powered by FFCreatorLite',
        x: 400,
        y: 520,
        fontSize: 24,
        duration: 4,
        appearTime: 2,
      });
      subtitle.setColor('#ffcc00');
      subtitle.addEffect('fadeIn', 1, 0);

      scene.addChild(video);
      scene.addChild(title);
      scene.addChild(subtitle);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });
  });

  describe('Scene Transitions', () => {
    test('should create scene with transition effects', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found');
        return;
      }

      // Set scene background color
      scene.setBgColor('#1a1a1a');

      // Add transition effect
      scene.setTransition('fade', 1000);

      const video = new FFVideo({
        path: videoPath,
        x: 200,
        y: 150,
        width: 400,
        height: 300,
        duration: 5,
        appearTime: 0,
      });
      video.addEffect('zoomIn', 2, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });
  });

  describe('Video Properties and Timing', () => {
    test('should handle video clipping correctly', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found');
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 200,
        y: 150,
        width: 400,
        height: 300,
        duration: 3,
        appearTime: 1,
        clipStartTime: 2,
        clipEndTime: 5,
      });
      video.addEffect('fadeIn', 0.5, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });

    test('should handle video scaling and positioning', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found');
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 150,
        y: 100,
        width: 500,
        height: 400,
        duration: 4,
        appearTime: 0,
      });
      video.setScale(0.8);
      video.setRotate(5);
      video.addEffect('rotateIn', 2, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });
  });

  describe('Performance and Error Handling', () => {
    test('should handle invalid video path gracefully', async () => {
      const invalidPath = path.join(__dirname, 'nonexistent-video.mp4');

      const video = new FFVideo({
        path: invalidPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 3,
        appearTime: 0,
      });

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      // Should fail gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle empty scene', async () => {
      // Create scene with no children
      scene.setBgColor('#000000');
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });
  });
});

/**
 * Helper function to render a scene and return the result
 * @param {FFCreator} creator - The FFCreator instance
 * @returns {Promise<object>} - Result object with success status and output path
 */
function renderScene(creator) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Scene rendering timed out'));
    }, 30000); // 30 seconds timeout for complex scenes

    creator.on('complete', event => {
      clearTimeout(timeout);
      resolve({
        success: true,
        outputPath: event.output,
        event,
      });
    });

    creator.on('error', error => {
      clearTimeout(timeout);
      resolve({
        success: false,
        error: error.error || error.message,
        outputPath: null,
      });
    });

    try {
      creator.start();
    } catch (error) {
      clearTimeout(timeout);
      resolve({
        success: false,
        error: error.message,
        outputPath: null,
      });
    }
  });
}
