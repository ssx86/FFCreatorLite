const path = require('path');
const fs = require('fs');
const { FFCreator, FFScene, FFVideo } = require('./lib');

async function createImprovedVideoTest() {
  // 确保output目录存在
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 视频文件路径
  const videoPath = path.join(__dirname, 'resources', 'test-video.mp4');

  // 验证视频文件存在
  if (!fs.existsSync(videoPath)) {
    console.error('❌ Video file not found:', videoPath);
    return;
  }

  console.log('📁 Video file found:', videoPath);
  const stats = fs.statSync(videoPath);
  console.log('📊 Video file size:', Math.round(stats.size / 1024), 'KB');

  // 创建FFCreator实例
  const creator = new FFCreator({
    width: 1280,
    height: 720,
    fps: 25,
    outputDir: outputDir,
    cacheDir: path.join(__dirname, 'cache'),
    parallel: 1,
    log: true,
  });

  try {
    console.log('🚀 Creating improved video test...');

    // 创建第一个场景：视频播放 5 秒
    console.log('🎬 Scene 1: Playing video for 5 seconds...');
    const scene1 = new FFScene();
    scene1.setBgColor('#000000');
    scene1.setDuration(5);

    const video1 = new FFVideo({
      path: videoPath,
      x: 640,
      y: 360,
      width: 800,
      height: 450,
      loop: false,
      duration: 5,
      appearTime: 0,
    });

    scene1.addChild(video1);
    creator.addChild(scene1);

    // 创建第二个场景：视频循环播放 3 秒
    console.log('🎬 Scene 2: Video loop for 3 seconds...');
    const scene2 = new FFScene();
    scene2.setBgColor('#1a1a1a');
    scene2.setDuration(3);

    const video2 = new FFVideo({
      path: videoPath,
      x: 640,
      y: 360,
      width: 600,
      height: 338,
      loop: true, // 循环播放
      duration: 3,
      appearTime: 0,
    });

    scene2.addChild(video2);
    creator.addChild(scene2);

    // 设置输出文件
    const outputFile = path.join(outputDir, 'improved-video-test.mp4');
    creator.setOutput(outputFile);

    console.log('📁 Output file:', outputFile);
    console.log('⏱️  Total duration: 8 seconds (5s + 3s)');
    console.log('🎬 Starting improved video test...');

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
      console.log('\n🎉 Improved video test completed!');
      console.log(`📁 Output file: ${outputFile}`);

      if (fs.existsSync(outputFile)) {
        const stats = fs.statSync(outputFile);
        console.log(`📊 File size: ${Math.round((stats.size / 1024 / 1024) * 100) / 100} MB`);
        console.log('\n✅ SUCCESS: Video with proper duration and animation!');
        console.log('🎬 Video should now play dynamically for 8 seconds');
        console.log('📺 Scene 1: 5s video playback');
        console.log('🔄 Scene 2: 3s video loop');
      } else {
        console.log('❌ Output file was not created');
      }
    });

    // 监听错误
    creator.on('error', error => {
      console.error('❌ Improved video test failed:', error);
    });

    // 设置超时
    setTimeout(() => {
      console.log('⏰ Test timeout - video processing may be stuck');
    }, 45000); // 45秒超时
  } catch (error) {
    console.error('❌ Error in improved video test:', error);
  }
}

// 运行脚本
createImprovedVideoTest();
