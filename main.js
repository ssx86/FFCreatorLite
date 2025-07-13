const path = require('path');
const fs = require('fs');
const { FFCreator, FFScene, FFText, FFImage, FFVideo } = require('./lib');

async function createComplexVideo() {
  // 确保output目录存在
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 资源文件路径
  const resources = {
    audio: path.join(__dirname, 'resources', 'test-audio.wav'),
    video: path.join(__dirname, 'resources', 'test-video.mp4'),
    blackBg: path.join(__dirname, 'resources', 'black-bg.png'),
    testImage: path.join(__dirname, 'resources', 'test-image.png'),
    testImageRed: path.join(__dirname, 'resources', 'test-image-red.png'),
    font: path.join(__dirname, 'resources', '站酷仓耳渔阳体-W03.ttf'),
  };

  // 创建FFCreator实例
  const creator = new FFCreator({
    width: 1280,
    height: 720,
    fps: 30,
    outputDir: outputDir,
    cacheDir: path.join(__dirname, 'cache'),
    parallel: 1,
    log: true,
    debug: false,
    background: '#000000',
    audioLoop: false,
    defaultOutputOptions: null,
    ffmpeglog: true,
    detailedProgress: false,
    upStreaming: false,
    video: {
      codec: 'libx264',
      bitrate: '2000k',
      preset: 'medium',
      crf: 20,
      profile: 'high',
      level: '4.1',
      maxrate: '2000k',
      bufsize: '4000k',
      gop: 30,
      pix_fmt: 'yuv420p',
      r: 30,
    },
    audio: {
      codec: 'aac',
      bitrate: '128k',
      samplerate: 44100,
      channels: 2,
      ar: 44100,
    },
  });

  try {
    // 场景1：介绍场景 - 使用黑色背景和文字动画
    console.log('Creating Scene 1: Introduction with animated text...');

    const scene1 = new FFScene();
    scene1.setBgColor('#000000');
    scene1.setDuration(4);

    // 添加背景图片
    const bgImage1 = new FFImage({
      path: resources.blackBg,
      x: 640,
      y: 360,
      width: 1280,
      height: 720,
    });
    scene1.addChild(bgImage1);

    // 添加标题文字
    const titleText = new FFText({
      text: '欢迎来到 FFCreatorLite',
      x: 640,
      y: 200,
      fontSize: 48,
      color: '#ffffff',
      fontFamily: resources.font,
      alignment: 'center',
      fontWeight: 'bold',
    });
    titleText.addEffect('fadeIn', 1, 0);
    titleText.addEffect('moveInUp', 1, 0);
    scene1.addChild(titleText);

    // 添加副标题
    const subtitleText = new FFText({
      text: '一个强大的视频创作工具',
      x: 640,
      y: 280,
      fontSize: 24,
      color: '#cccccc',
      fontFamily: resources.font,
      alignment: 'center',
    });
    subtitleText.addEffect('fadeIn', 1, 1);
    subtitleText.addEffect('moveInDown', 1, 1);
    scene1.addChild(subtitleText);

    creator.addChild(scene1);

    // 场景2：视频展示场景 - 使用test-video.mp4
    console.log('Creating Scene 2: Video showcase with effects...');

    const scene2 = new FFScene();
    scene2.setBgColor('#111111');
    scene2.setDuration(6);

    // 添加背景视频
    const bgVideo = new FFVideo({
      path: resources.video,
      x: 640,
      y: 360,
      width: 1280,
      height: 720,
      loop: true,
    });
    bgVideo.addEffect('fadeIn', 1, 0);
    scene2.addChild(bgVideo);

    // 添加覆盖文字
    const videoText = new FFText({
      text: '精彩视频内容',
      x: 640,
      y: 100,
      fontSize: 36,
      color: '#ffffff',
      fontFamily: resources.font,
      alignment: 'center',
      fontWeight: 'bold',
    });
    videoText.addEffect('fadeIn', 1, 1);
    videoText.addEffect('rotateIn', 1, 1);
    scene2.addChild(videoText);

    // 添加装饰图片
    const decorImage = new FFImage({
      path: resources.testImage,
      x: 200,
      y: 500,
      width: 120,
      height: 120,
    });
    decorImage.addEffect('fadeIn', 1, 2);
    decorImage.addEffect('zoomIn', 1, 2);
    scene2.addChild(decorImage);

    creator.addChild(scene2);

    // 场景3：图片展示场景 - 使用多个图片和复杂动画
    console.log('Creating Scene 3: Image showcase with complex animations...');

    const scene3 = new FFScene();
    scene3.setBgColor('#222222');
    scene3.setDuration(5);

    // 主要图片
    const mainImage = new FFImage({
      path: resources.testImage,
      x: 640,
      y: 360,
      width: 400,
      height: 300,
    });
    mainImage.addEffect('fadeIn', 1, 0);
    mainImage.addEffect('zoomIn', 1, 0);
    scene3.addChild(mainImage);

    // 红色装饰图片
    const redImage = new FFImage({
      path: resources.testImageRed,
      x: 1000,
      y: 200,
      width: 200,
      height: 150,
    });
    redImage.addEffect('fadeIn', 1, 1);
    redImage.addEffect('moveInRight', 1, 1);
    redImage.addEffect('rotateIn', 1, 1);
    scene3.addChild(redImage);

    // 另一个装饰图片
    const sideImage = new FFImage({
      path: resources.testImage,
      x: 280,
      y: 200,
      width: 150,
      height: 100,
    });
    sideImage.addEffect('fadeIn', 1, 2);
    sideImage.addEffect('moveInLeft', 1, 2);
    scene3.addChild(sideImage);

    // 文字说明
    const imageText = new FFText({
      text: '多样化的图片展示',
      x: 640,
      y: 600,
      fontSize: 28,
      color: '#ffffff',
      fontFamily: resources.font,
      alignment: 'center',
    });
    imageText.addEffect('fadeIn', 1, 3);
    imageText.addEffect('moveInUp', 1, 3);
    scene3.addChild(imageText);

    creator.addChild(scene3);

    // 场景4：结束场景 - 使用所有元素的组合
    console.log('Creating Scene 4: Final scene with all elements...');

    const scene4 = new FFScene();
    scene4.setBgColor('#000000');
    scene4.setDuration(4);

    // 背景
    const finalBg = new FFImage({
      path: resources.blackBg,
      x: 640,
      y: 360,
      width: 1280,
      height: 720,
    });
    scene4.addChild(finalBg);

    // 感谢文字
    const thanksText = new FFText({
      text: '感谢观看！',
      x: 640,
      y: 300,
      fontSize: 56,
      color: '#ffffff',
      fontFamily: resources.font,
      alignment: 'center',
      fontWeight: 'bold',
    });
    thanksText.addEffect('fadeIn', 1, 0);
    thanksText.addEffect('zoomIn', 1, 0);
    scene4.addChild(thanksText);

    // 版权信息
    const copyrightText = new FFText({
      text: 'Powered by FFCreatorLite',
      x: 640,
      y: 400,
      fontSize: 20,
      color: '#cccccc',
      fontFamily: resources.font,
      alignment: 'center',
    });
    copyrightText.addEffect('fadeIn', 1, 1);
    scene4.addChild(copyrightText);

    // 小装饰图片
    const finalDecor1 = new FFImage({
      path: resources.testImage,
      x: 400,
      y: 500,
      width: 80,
      height: 60,
    });
    finalDecor1.addEffect('fadeIn', 1, 2);
    finalDecor1.addEffect('rotateIn', 1, 2);
    scene4.addChild(finalDecor1);

    const finalDecor2 = new FFImage({
      path: resources.testImageRed,
      x: 880,
      y: 500,
      width: 80,
      height: 60,
    });
    finalDecor2.addEffect('fadeIn', 1, 2);
    finalDecor2.addEffect('rotateIn', 1, 2);
    scene4.addChild(finalDecor2);

    creator.addChild(scene4);

    // 添加背景音乐
    console.log('Adding background audio...');
    creator.addAudio({
      path: resources.audio,
      volume: 0.5,
      fadeIn: 1,
      fadeOut: 1,
      loop: true,
    });

    // 设置输出文件
    const outputFile = path.join(outputDir, 'complex-video.mp4');
    creator.setOutput(outputFile);

    console.log('Starting video generation...');
    console.log('Output file:', outputFile);
    console.log('Total duration: ~19 seconds');
    console.log('Using resources:');
    Object.entries(resources).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });

    // 开始生成视频
    creator.start();

    // 监听进度
    creator.on('progress', progress => {
      console.log(`Progress: ${Math.round(progress * 100)}%`);
    });

    // 监听完成
    creator.on('complete', () => {
      console.log('✅ Video generation completed successfully!');
      console.log(`📁 Output file: ${outputFile}`);
      console.log(`📊 File size: ${fs.statSync(outputFile).size} bytes`);
      console.log('🎉 All resources have been successfully integrated!');
    });

    // 监听错误
    creator.on('error', error => {
      console.error('❌ Video generation failed:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Error creating video:', error);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  console.log('🚀 Starting complex video generation...');
  createComplexVideo();
}

module.exports = createComplexVideo;
