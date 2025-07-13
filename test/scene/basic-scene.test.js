const path = require('path');
const fs = require('fs-extra');
const { FFCreator, FFScene, FFVideo, FFText } = require('../../lib/index');

describe('Basic Scene Tests', () => {
  let creator;
  let scene;
  let outputDir;
  let cacheDir;

  beforeAll(async () => {
    // Setup test directories
    outputDir = path.join(__dirname, './output/');
    cacheDir = path.join(__dirname, './cache/');

    await fs.ensureDir(outputDir);
    await fs.ensureDir(cacheDir);
  });

  beforeEach(() => {
    // Create a new creator instance for each test
    creator = new FFCreator({
      cacheDir,
      outputDir,
      width: 640,
      height: 360,
      log: false,
    });

    scene = new FFScene();
    scene.setDuration(3); // Short duration for faster tests
  });

  afterEach(async () => {
    if (creator) {
      try {
        creator.destroy();
      } catch (error) {
        console.warn('Warning: Error destroying creator:', error.message);
      }
    }
  });

  afterAll(async () => {
    // Clean up test directories
    try {
      await fs.remove(outputDir);
      await fs.remove(cacheDir);
    } catch (error) {
      console.warn('Warning: Could not clean up test directories:', error.message);
    }
  });

  describe('Scene Creation', () => {
    test('should create a basic scene with video', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      // Skip test if video file doesn't exist
      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found at', videoPath);
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 200,
        duration: 3,
        appearTime: 0,
      });

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });

    test('should create scene with video and text', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      // Skip test if video file doesn't exist
      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found at', videoPath);
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 50,
        y: 50,
        width: 300,
        height: 200,
        duration: 3,
        appearTime: 0,
      });

      const text = new FFText({
        text: 'Test Video',
        x: 200,
        y: 30,
        fontSize: 24,
        duration: 3,
        appearTime: 0,
      });
      text.setColor('#ffffff');

      scene.addChild(video);
      scene.addChild(text);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });

    test('should create scene with video fade effect', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      // Skip test if video file doesn't exist
      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found at', videoPath);
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 200,
        duration: 3,
        appearTime: 0,
      });
      video.addEffect('fadeIn', 1, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });

    test('should create scene with video move effect', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      // Skip test if video file doesn't exist
      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found at', videoPath);
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 200,
        y: 150,
        width: 300,
        height: 180,
        duration: 3,
        appearTime: 0,
      });
      video.addEffect('moveInLeft', 1, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await renderScene(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await fs.pathExists(result.outputPath)).toBe(true);
    });
  });

  describe('Scene Properties', () => {
    test('should set scene duration correctly', () => {
      scene.setDuration(5);
      expect(scene.duration).toBe(5);
    });

    test('should set scene background color', () => {
      scene.setBgColor('#ff0000');
      expect(scene.background).toBeDefined();
      expect(scene.background.color).toBe('#ff0000');
    });

    test('should add transition to scene', () => {
      scene.setTransition('fade', 1);
      expect(scene.transition).toBeDefined();
      expect(scene.transition.name).toBe('fade');
    });
  });

  describe('Video Properties', () => {
    test('should set video properties correctly', async () => {
      const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');

      // Skip test if video file doesn't exist
      if (!(await fs.pathExists(videoPath))) {
        console.warn('Skipping test: Video file not found at', videoPath);
        return;
      }

      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 200,
        duration: 3,
        appearTime: 1,
        clipStartTime: 0,
        clipEndTime: 3,
      });

      expect(video.conf.path).toBe(videoPath);
      expect(video.conf.width).toBe(400);
      expect(video.conf.height).toBe(200);
      expect(video.conf.duration).toBe(3);
      expect(video.conf.appearTime).toBe(1);
      expect(video.conf.clipStartTime).toBe(0);
      expect(video.conf.clipEndTime).toBe(3);
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
    }, 20000); // 20 seconds timeout

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
