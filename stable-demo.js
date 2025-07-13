const path = require('path');
const fs = require('fs');
const { FFCreator, FFScene, FFImage } = require('./lib');

async function createStableDemo() {
  // 确保output目录存在
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 资源文件路径 - 只使用图片资源，避免音视频复杂性
  const resources = {
    blackBg: path.join(__dirname, 'resources', 'black-bg.png'),
    testImage: path.join(__dirname, 'resources', 'test-image.png'),
    testImageRed: path.join(__dirname, 'resources', 'test-image-red.png'),
  };

  // 创建FFCreator实例 - 最稳定的配置
  const creator = new FFCreator({
    width: 1280,
    height: 720,
    fps: 25,
    outputDir: outputDir,
    cacheDir: path.join(__dirname, 'cache'),
    parallel: 1,
    log: false,
  });

  try {
    console.log('🚀 Creating stable demo with image resources...');

    // 场景1：黑色背景
    console.log('📷 Scene 1: Black background');
    const scene1 = new FFScene();
    scene1.setBgColor('#000000');
    scene1.setDuration(2);

    const bgImage = new FFImage({
      path: resources.blackBg,
      x: 640,
      y: 360,
      width: 1280,
      height: 720,
    });
    scene1.addChild(bgImage);
    creator.addChild(scene1);

    // 场景2：测试图片
    console.log('📷 Scene 2: Test image');
    const scene2 = new FFScene();
    scene2.setBgColor('#111111');
    scene2.setDuration(2);

    const testImg = new FFImage({
      path: resources.testImage,
      x: 640,
      y: 360,
      width: 600,
      height: 400,
    });
    scene2.addChild(testImg);
    creator.addChild(scene2);

    // 场景3：红色测试图片
    console.log('📷 Scene 3: Red test image');
    const scene3 = new FFScene();
    scene3.setBgColor('#222222');
    scene3.setDuration(2);

    const redImg = new FFImage({
      path: resources.testImageRed,
      x: 640,
      y: 360,
      width: 600,
      height: 400,
    });
    scene3.addChild(redImg);
    creator.addChild(scene3);

    // 场景4：图片组合
    console.log('📷 Scene 4: Multiple images');
    const scene4 = new FFScene();
    scene4.setBgColor('#333333');
    scene4.setDuration(3);

    // 左侧图片
    const leftImg = new FFImage({
      path: resources.testImage,
      x: 400,
      y: 360,
      width: 350,
      height: 250,
    });
    scene4.addChild(leftImg);

    // 右侧图片
    const rightImg = new FFImage({
      path: resources.testImageRed,
      x: 880,
      y: 360,
      width: 350,
      height: 250,
    });
    scene4.addChild(rightImg);

    creator.addChild(scene4);

    // 设置输出文件
    const outputFile = path.join(outputDir, 'stable-demo.mp4');
    creator.setOutput(outputFile);

    console.log('📁 Output file:', outputFile);
    console.log('⏱️  Total duration: 9 seconds');
    console.log('📦 Image resources used:');
    console.log('  ✓ black-bg.png');
    console.log('  ✓ test-image.png');
    console.log('  ✓ test-image-red.png');
    console.log('🎬 Starting stable generation...');

    // 开始生成视频
    creator.start();

    // 监听进度
    creator.on('progress', progress => {
      if (!isNaN(progress)) {
        console.log(`Progress: ${Math.round(progress * 100)}%`);
      } else {
        console.log('Processing...');
      }
    });

    // 监听完成
    creator.on('complete', () => {
      console.log('\n🎉 Stable demo completed successfully!');
      console.log(`📁 Output file: ${outputFile}`);

      if (fs.existsSync(outputFile)) {
        const stats = fs.statSync(outputFile);
        console.log(`📊 File size: ${Math.round((stats.size / 1024 / 1024) * 100) / 100} MB`);
        console.log('\n✅ Successfully created video with:');
        console.log('  📸 Multiple image scenes');
        console.log('  🎨 Different background colors');
        console.log('  ⚡ Fast and stable processing');
        console.log('\n🚀 This demonstrates stable image-based video generation!');
      } else {
        console.log('❌ Output file was not created');
      }
    });

    // 监听错误
    creator.on('error', error => {
      console.error('❌ Stable demo failed:', error);
    });
  } catch (error) {
    console.error('❌ Error in stable demo:', error);
  }
}

// 运行脚本
createStableDemo();
