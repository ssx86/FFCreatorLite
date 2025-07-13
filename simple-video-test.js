const path = require('path');
const fs = require('fs');
const { FFCreator, FFScene, FFVideo } = require('./lib');

async function createSimpleVideoTest() {
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

  // 创建FFCreator实例 - 最简单的配置
  const creator = new FFCreator({
    width: 1280,
    height: 720,
    fps: 25,
    outputDir: outputDir,
    cacheDir: path.join(__dirname, 'cache'),
    parallel: 1,
    log: true, // 开启日志以便调试
  });

  try {
    console.log('🚀 Creating simple video test...');

    // 只创建一个视频场景
    console.log('🎬 Creating video scene with test-video.mp4...');
    const scene = new FFScene();
    scene.setBgColor('#000000');
    scene.setDuration(3); // 短时间测试

    const video = new FFVideo({
      path: videoPath,
      x: 640,
      y: 360,
      width: 640, // 较小尺寸
      height: 360,
      loop: false, // 不循环，简化处理
      duration: 3, // 设置视频播放时长
      appearTime: 0, // 视频开始播放时间
    });

    scene.addChild(video);
    creator.addChild(scene);

    // 设置输出文件
    const outputFile = path.join(outputDir, 'simple-video-test.mp4');
    creator.setOutput(outputFile);

    console.log('📁 Output file:', outputFile);
    console.log('⏱️  Duration: 3 seconds');
    console.log('🎬 Starting simple video test...');

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
      console.log('\n🎉 Simple video test completed!');
      console.log(`📁 Output file: ${outputFile}`);

      if (fs.existsSync(outputFile)) {
        const stats = fs.statSync(outputFile);
        console.log(`📊 File size: ${Math.round((stats.size / 1024 / 1024) * 100) / 100} MB`);
        console.log('\n✅ SUCCESS: test-video.mp4 is working!');
        console.log('🎬 Video playback confirmed in the output file');
      } else {
        console.log('❌ Output file was not created');
      }
    });

    // 监听错误
    creator.on('error', error => {
      console.error('❌ Simple video test failed:', error);
    });

    // 设置超时防止卡住
    setTimeout(() => {
      console.log('⏰ Test timeout - this may indicate video processing issues');
      console.log('💡 Suggestion: The video file may need different encoding or be too complex');
    }, 30000); // 30秒超时
  } catch (error) {
    console.error('❌ Error in simple video test:', error);
  }
}

// 运行脚本
createSimpleVideoTest();
