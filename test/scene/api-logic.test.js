const { FFCreator, FFScene, FFVideo, FFText } = require('../../lib/index');
const TestSetup = require('./test-setup');

// 这些测试专注于API逻辑正确性，避免依赖FFmpeg环境
describe('Scene API Logic Tests', () => {
  let testSetup;

  beforeEach(async () => {
    testSetup = new TestSetup();
    await testSetup.setup();
  });

  afterEach(async () => {
    if (testSetup) {
      await testSetup.cleanup();
    }
  });

  describe('Scene API Tests', () => {
    test('should create scene with correct properties', () => {
      const scene = new FFScene();

      expect(scene).toBeDefined();
      expect(scene.type).toBe('scene');
      expect(scene.duration).toBe(10); // Default duration

      // Test duration setting
      scene.setDuration(5);
      expect(scene.duration).toBe(5);

      // Test background color
      scene.setBgColor('#ff0000');
      expect(scene.background).toBeDefined();
      expect(scene.background.color).toBe('#ff0000');

      // Test transition
      scene.setTransition('fade', 1000);
      expect(scene.transition).toBeDefined();
      expect(scene.transition.name).toBe('fade');
    });

    test('should add children to scene correctly', () => {
      const scene = new FFScene();

      const video = new FFVideo({
        path: 'test.mp4',
        x: 100,
        y: 100,
        width: 400,
        height: 300,
      });

      const text = new FFText({
        text: 'Test Text',
        x: 200,
        y: 150,
        fontSize: 24,
      });

      scene.addChild(video);
      scene.addChild(text);

      expect(scene.children).toBeDefined();
      expect(scene.children.length).toBe(3); // background + video + text
      expect(scene.children[1]).toBe(video);
      expect(scene.children[2]).toBe(text);
    });
  });

  describe('Video API Tests', () => {
    test('should create video with correct properties', () => {
      const videoPath = 'test-video.mp4';
      const video = new FFVideo({
        path: videoPath,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 5,
        appearTime: 1,
        clipStartTime: 0,
        clipEndTime: 3,
      });

      expect(video).toBeDefined();
      expect(video.type).toBe('video');
      expect(video.conf.path).toBe(videoPath);
      expect(video.conf.x).toBe(100);
      expect(video.conf.y).toBe(100);
      expect(video.conf.width).toBe(400);
      expect(video.conf.height).toBe(300);
      expect(video.conf.duration).toBe(5);
      expect(video.conf.appearTime).toBe(1);
      expect(video.conf.clipStartTime).toBe(0);
      expect(video.conf.clipEndTime).toBe(3);
    });

    test('should add effects to video correctly', () => {
      const video = new FFVideo({
        path: 'test.mp4',
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        duration: 5,
      });

      // Test adding effects
      video.addEffect('fadeIn', 1, 0);
      expect(video.animations).toBeDefined();
      expect(video.animations.list).toBeDefined();
      expect(video.animations.list.length).toBeGreaterThan(0);

      // Test multiple effects
      video.addEffect('zoomIn', 2, 1);
      expect(video.animations.list.length).toBeGreaterThan(1);
    });

    test('should set video properties correctly', () => {
      const video = new FFVideo({
        path: 'test.mp4',
        x: 100,
        y: 100,
        width: 400,
        height: 300,
      });

      // Test scale
      video.setScale(1.5);
      expect(video.scale).toBe(1.5);

      // Test rotation
      video.setRotate(45);
      expect(video.rotate).toBe(45);

      // Test position
      video.setXY(200, 250);
      expect(video.x).toBe(200);
      expect(video.y).toBe(250);

      // Test size
      video.setWH(500, 400);
      expect(video.w).toBe(500);
      expect(video.h).toBe(400);
    });

    test('should add custom animations', () => {
      const video = new FFVideo({
        path: 'test.mp4',
        x: 100,
        y: 100,
        width: 400,
        height: 300,
      });

      const customAnimation = {
        type: 'move',
        showType: 'in',
        time: 2,
        delay: 1,
        from: { x: 0, y: 0 },
        to: { x: 200, y: 150 },
        ease: 'quadOut',
      };

      video.addAnimate(customAnimation);
      expect(video.animations.list.length).toBeGreaterThan(0);
    });
  });

  describe('Text API Tests', () => {
    test('should create text with correct properties', () => {
      const text = new FFText({
        text: 'Hello World',
        x: 200,
        y: 150,
        fontSize: 32,
        duration: 3,
        appearTime: 1,
      });

      expect(text).toBeDefined();
      expect(text.type).toBe('text');
      expect(text.text).toBe('Hello World');
      expect(text.conf.fontSize).toBe(32);
      expect(text.conf.duration).toBe(3);
      expect(text.conf.appearTime).toBe(1);
    });

    test('should set text styling correctly', () => {
      const text = new FFText({
        text: 'Styled Text',
        x: 200,
        y: 150,
        fontSize: 24,
      });

      // Test color
      text.setColor('#ffffff');
      expect(text.fontcolor).toBe('#ffffff');

      // Test background color
      text.setBackgroundColor('#000000');
      expect(text.boxcolor).toBe('#000000');

      // Test border
      text.setBorder(2, '#ff0000');
      // Border functionality should be available
      expect(typeof text.setBorder).toBe('function');
    });

    test('should add effects to text', () => {
      const text = new FFText({
        text: 'Animated Text',
        x: 200,
        y: 150,
        fontSize: 24,
      });

      text.addEffect('fadeIn', 1, 0);
      expect(text.animations).toBeDefined();
      expect(text.animations.list.length).toBeGreaterThan(0);

      text.addEffect('moveInLeft', 1.5, 0);
      expect(text.animations.list.length).toBeGreaterThan(1);
    });
  });

  describe('Creator API Tests', () => {
    test('should create creator with correct configuration', () => {
      const config = testSetup.getCreatorConfig({
        width: 1920,
        height: 1080,
        fps: 30,
      });

      const creator = new FFCreator(config);

      expect(creator).toBeDefined();
      expect(creator.type).toBe('creator');
      expect(creator.getConf('width')).toBe(1920);
      expect(creator.getConf('height')).toBe(1080);
      expect(creator.getConf('fps')).toBe(30);

      testSetup.destroyCreator(creator);
    });

    test('should add scenes to creator', () => {
      const config = testSetup.getCreatorConfig();
      const creator = new FFCreator(config);

      const scene1 = new FFScene();
      scene1.setDuration(5);

      const scene2 = new FFScene();
      scene2.setDuration(3);

      creator.addChild(scene1);
      creator.addChild(scene2);

      expect(creator.scenes).toBeDefined();
      expect(creator.scenes.length).toBe(2);
      expect(creator.scenes[0]).toBe(scene1);
      expect(creator.scenes[1]).toBe(scene2);

      testSetup.destroyCreator(creator);
    });

    test('should configure creator settings', () => {
      const config = testSetup.getCreatorConfig();
      const creator = new FFCreator(config);

      // Test configuration methods
      creator.setSize(800, 600);
      expect(creator.getConf('w')).toBe(800);
      expect(creator.getConf('h')).toBe(600);

      // Test log settings
      creator.openLog();
      expect(creator.getConf('log')).toBe(true);

      creator.closeLog();
      expect(creator.getConf('log')).toBe(false);

      testSetup.destroyCreator(creator);
    });
  });

  describe('Effects API Tests', () => {
    test('should have access to all standard effects', () => {
      const video = new FFVideo({
        path: 'test.mp4',
        x: 100,
        y: 100,
        width: 400,
        height: 300,
      });

      const fadeEffects = ['fadeIn', 'fadeOut'];
      const moveEffects = ['moveInLeft', 'moveInRight', 'moveInUp', 'moveInDown'];
      const zoomEffects = ['zoomIn', 'zoomOut'];
      const rotateEffects = ['rotateIn', 'rotateOut'];

      const allEffects = [...fadeEffects, ...moveEffects, ...zoomEffects, ...rotateEffects];

      allEffects.forEach(effect => {
        const initialCount = video.animations.list.length;
        video.addEffect(effect, 1, 0);
        expect(video.animations.list.length).toBeGreaterThan(initialCount);
      });

      // Some effects may add multiple animation components, so check that we have at least the expected number
      expect(video.animations.list.length).toBeGreaterThanOrEqual(allEffects.length);
    });
  });

  describe('Integration Logic Tests', () => {
    test('should create complete scene composition', () => {
      const config = testSetup.getCreatorConfig();
      const creator = new FFCreator(config);

      const scene = new FFScene();
      scene.setDuration(6);
      scene.setBgColor('#1a1a1a');

      const video = new FFVideo({
        path: 'test-video.mp4',
        x: 100,
        y: 100,
        width: 600,
        height: 400,
        duration: 5,
        appearTime: 0,
      });
      video.addEffect('fadeIn', 1, 0);
      video.addEffect('zoomIn', 2, 1);

      const title = new FFText({
        text: 'Test Title',
        x: 400,
        y: 80,
        fontSize: 36,
        duration: 4,
        appearTime: 1,
      });
      title.setColor('#ffffff');
      title.addEffect('moveInLeft', 1.5, 0);

      const subtitle = new FFText({
        text: 'Subtitle',
        x: 400,
        y: 520,
        fontSize: 24,
        duration: 3,
        appearTime: 2,
      });
      subtitle.setColor('#ffcc00');
      subtitle.addEffect('fadeIn', 1, 0);

      scene.addChild(video);
      scene.addChild(title);
      scene.addChild(subtitle);
      creator.addChild(scene);

      // Verify scene composition
      expect(scene.children.length).toBe(4); // background + video + title + subtitle
      expect(scene.duration).toBe(6);
      expect(creator.scenes.length).toBe(1);

      // Verify animations were added
      expect(video.animations.list.length).toBeGreaterThan(0);
      expect(title.animations.list.length).toBeGreaterThan(0);
      expect(subtitle.animations.list.length).toBeGreaterThan(0);

      testSetup.destroyCreator(creator);
    });
  });
});
