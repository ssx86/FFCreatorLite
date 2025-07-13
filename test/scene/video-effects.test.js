const path = require('path');
const fs = require('fs-extra');
const { FFCreator, FFScene, FFVideo, FFImage, FFText } = require('../../lib/index');
const TestUtils = require('./utils/test-utils');

describe('Scene Video Effects Tests', () => {
  let creator;
  let scene;
  let outputDir;
  let cacheDir;
  let videoPath;
  let testUtils;

  beforeEach(() => {
    outputDir = path.join(__dirname, './output/');
    cacheDir = path.join(__dirname, './cache/');
    videoPath = path.join(__dirname, '../assets/video/video1.mp4');
    testUtils = new TestUtils();

    // Ensure directories exist
    fs.ensureDirSync(outputDir);
    fs.ensureDirSync(cacheDir);

    // Create a simple creator instance
    creator = new FFCreator({
      cacheDir,
      outputDir,
      width: 640,
      height: 360,
      log: false,
    });

    scene = new FFScene();
    scene.setDuration(5);
  });

  afterEach(async () => {
    if (creator) {
      creator.destroy();
    }

    // Clean up cache and output directories
    await testUtils.cleanupDirectories([cacheDir, outputDir]);
  });

  describe('Video with Fade Effects', () => {
    test('should create scene with video fadeIn effect', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 3,
        appearTime: 1,
      });
      video.addEffect('fadeIn', 1, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });

    test('should create scene with video fadeOut effect', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 3,
        appearTime: 0,
      });
      video.addEffect('fadeOut', 1, 2);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });
  });

  describe('Video with Movement Effects', () => {
    test('should create scene with video moveInLeft effect', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 200,
        y: 150,
        width: 300,
        height: 200,
        duration: 3,
        appearTime: 0,
      });
      video.addEffect('moveInLeft', 1.5, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });

    test('should create scene with video moveInRight effect', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 200,
        y: 150,
        width: 300,
        height: 200,
        duration: 3,
        appearTime: 0,
      });
      video.addEffect('moveInRight', 1.5, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });
  });

  describe('Video with Zoom Effects', () => {
    test('should create scene with video zoomIn effect', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 3,
        appearTime: 0,
      });
      video.addEffect('zoomIn', 2, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });

    test('should create scene with video zoomOut effect', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 3,
        appearTime: 0,
      });
      video.addEffect('zoomOut', 2, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });
  });

  describe('Video with Rotation Effects', () => {
    test('should create scene with video rotateIn effect', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 200,
        y: 150,
        width: 300,
        height: 200,
        duration: 3,
        appearTime: 0,
      });
      video.addEffect('rotateIn', 2, 0);

      scene.addChild(video);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });
  });

  describe('Multiple Videos with Different Effects', () => {
    test('should create scene with multiple videos and effects', async () => {
      const video1 = new FFVideo({
        path: videoPath,
        x: 50,
        y: 50,
        width: 250,
        height: 150,
        duration: 3,
        appearTime: 0,
      });
      video1.addEffect('fadeIn', 1, 0);

      const video2 = new FFVideo({
        path: videoPath,
        x: 350,
        y: 50,
        width: 250,
        height: 150,
        duration: 3,
        appearTime: 1,
      });
      video2.addEffect('moveInRight', 1.5, 0);

      scene.addChild(video1);
      scene.addChild(video2);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });
  });

  describe('Video with Text and Effects', () => {
    test('should create scene with video and text effects', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 4,
        appearTime: 0,
      });
      video.addEffect('fadeIn', 1, 0);

      const text = new FFText({
        text: 'Video with Effects',
        x: 200,
        y: 50,
        fontSize: 32,
        appearTime: 1,
        duration: 3,
      });
      text.setColor('#ffffff');
      text.addEffect('moveInLeft', 1.5, 0);

      scene.addChild(video);
      scene.addChild(text);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();
      expect(await testUtils.videoExists(result.outputPath)).toBe(true);
    });
  });

  describe('Video Properties Validation', () => {
    test('should validate video duration and timing', async () => {
      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 3,
        appearTime: 1,
        clipStartTime: 0,
        clipEndTime: 3,
      });

      scene.addChild(video);
      creator.addChild(scene);

      const result = await testUtils.renderAndValidate(creator);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBeDefined();

      // Validate video duration
      const videoDuration = await testUtils.getVideoDuration(result.outputPath);
      expect(videoDuration).toBeCloseTo(5, 0); // Scene duration
    });
  });
});
