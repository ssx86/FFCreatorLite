# 常见问题解答 (FAQ)

## 视频播放问题

### Q1: 为什么生成的视频是静止帧？
**A:** 这是最常见的问题。原因是没有正确设置 `duration` 和 `appearTime` 参数。

```javascript
// ❌ 错误：缺少关键参数
const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450
});

// ✅ 正确：设置播放时长和开始时间
const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 5,      // 必须设置播放时长
  appearTime: 0     // 必须设置开始时间
});
```

### Q2: 视频播放不完整怎么办？
**A:** 确保场景时长 >= 视频播放时长。

```javascript
const scene = new FFScene();
scene.setDuration(5); // 场景5秒

const video = new FFVideo({
  path: './resources/test-video.mp4',
  duration: 5,      // 视频播放5秒，与场景时长一致
  appearTime: 0
});
```

### Q3: 如何让短视频循环播放？
**A:** 使用 `loop: true` 参数。

```javascript
const video = new FFVideo({
  path: './resources/short-video.mp4', // 假设只有2秒
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 6,      // 需要播放6秒
  appearTime: 0,
  loop: true        // 开启循环播放
});
```

## 字体和文本问题

### Q4: Windows系统显示"Fontconfig error"怎么办？
**A:** 这是Windows系统的字体配置问题。

**解决方案1：避免使用文本组件**
```javascript
// 在Windows系统上，建议避免使用FFText组件
// 使用图像代替文本
const textImage = new FFImage({
  path: './resources/text-as-image.png',
  x: 640,
  y: 360,
  width: 400,
  height: 100
});
```

**解决方案2：使用系统字体**
```javascript
const text = new FFText({
  text: 'Hello World',
  x: 640,
  y: 360,
  fontSize: 48,
  fontFamily: 'Arial', // 使用系统字体
  color: '#ffffff'
});
```

### Q5: 中文字体无法显示怎么办？
**A:** 检查字体文件路径和格式。

```javascript
// 确保字体文件存在
const fs = require('fs');
const fontPath = './resources/chinese-font.ttf';
if (!fs.existsSync(fontPath)) {
  console.error('Font file not found:', fontPath);
  return;
}

const text = new FFText({
  text: '中文测试',
  x: 640,
  y: 360,
  fontSize: 48,
  fontFamily: fontPath,
  color: '#ffffff'
});
```

## FFmpeg和编码问题

### Q6: FFmpeg filter_complex错误怎么解决？
**A:** 这通常是因为滤镜链过于复杂。

**解决方案：简化配置**
```javascript
const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  parallel: 1,     // 设置为1，避免并发问题
  log: false,      // 关闭日志减少复杂度
  debug: false     // 关闭调试模式
});
```

### Q7: 如何指定FFmpeg路径？
**A:** 在项目开始时设置FFmpeg路径。

```javascript
const ffmpeg = require('fluent-ffmpeg');

// 设置FFmpeg路径
ffmpeg.setFfmpegPath('/path/to/ffmpeg');
ffmpeg.setFfprobePath('/path/to/ffprobe');

// 或者在Windows上
ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');
ffmpeg.setFfprobePath('C:\\ffmpeg\\bin\\ffprobe.exe');
```

## 性能和资源问题

### Q8: 视频生成太慢怎么办？
**A:** 优化配置和资源。

```javascript
// 1. 降低分辨率
const creator = new FFCreator({
  width: 1280,    // 可以降低到 854x480
  height: 720,
  fps: 25,        // 可以降低到 15
  parallel: 1
});

// 2. 优化图像文件大小
// 3. 减少复杂动画
// 4. 使用SSD存储
```

### Q9: 内存使用过多怎么办？
**A:** 控制资源使用。

```javascript
// 1. 限制并行处理
const creator = new FFCreator({
  parallel: 1,     // 只使用一个进程
  cacheDir: './cache', // 使用本地缓存
  log: false       // 关闭日志节省内存
});

// 2. 及时清理缓存
// 3. 分批处理大量场景
```

### Q10: 缓存文件过多怎么办？
**A:** 定期清理缓存。

```javascript
const fs = require('fs');
const path = require('path');

// 清理缓存目录
function clearCache() {
  const cacheDir = './cache';
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('Cache cleared');
  }
}

// 在视频生成完成后清理
creator.on('complete', () => {
  console.log('Video completed');
  clearCache();
});
```

## 文件和路径问题

### Q11: 文件路径错误怎么办？
**A:** 使用绝对路径或正确的相对路径。

```javascript
const path = require('path');

// 使用绝对路径
const imagePath = path.join(__dirname, 'resources', 'test-image.png');

// 或者使用相对路径
const imagePath = './resources/test-image.png';

// 检查文件是否存在
if (!fs.existsSync(imagePath)) {
  console.error('File not found:', imagePath);
  return;
}
```

### Q12: 输出目录不存在怎么办？
**A:** 确保目录存在。

```javascript
const fs = require('fs');

// 确保输出目录存在
const outputDir = './output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const creator = new FFCreator({
  outputDir: outputDir
});
```

## 跨平台问题

### Q13: 在不同操作系统上运行有问题？
**A:** 使用跨平台的配置。

```javascript
const os = require('os');

// 根据操作系统调整配置
const isWindows = os.platform() === 'win32';

const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  parallel: isWindows ? 1 : 2,  // Windows使用单进程
  log: !isWindows,              // Windows关闭日志
  debug: false
});
```

### Q14: 路径分隔符问题？
**A:** 使用 Node.js 的 path 模块。

```javascript
const path = require('path');

// 正确的跨平台路径
const resourcePath = path.join(__dirname, 'resources', 'image.png');
const outputPath = path.join(__dirname, 'output', 'video.mp4');

// 避免硬编码路径分隔符
// ❌ 错误：./resources\image.png
// ✅ 正确：使用 path.join()
```

## 调试和排错

### Q15: 如何开启调试模式？
**A:** 使用调试配置。

```javascript
const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  parallel: 1,
  log: true,       // 开启日志
  debug: true      // 开启调试模式
});

// 监听所有事件
creator.on('start', () => console.log('Started'));
creator.on('progress', (progress) => console.log('Progress:', progress));
creator.on('error', (error) => console.error('Error:', error));
creator.on('complete', () => console.log('Completed'));
```

### Q16: 如何捕获和处理错误？
**A:** 使用错误处理机制。

```javascript
const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  parallel: 1
});

// 错误处理
creator.on('error', (error) => {
  console.error('Video generation failed:', error);
  
  // 清理资源
  creator.stop();
  
  // 清理缓存
  const cacheDir = './cache';
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }
});

// 设置超时
const timeout = setTimeout(() => {
  console.log('Video generation timeout');
  creator.stop();
}, 60000); // 60秒超时

creator.on('complete', () => {
  clearTimeout(timeout);
  console.log('Video generation completed');
});
```

## 最佳实践总结

### 通用配置
```javascript
const { FFCreator, FFScene, FFImage, FFVideo } = require('./lib');

const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  outputDir: './output',
  cacheDir: './cache',
  parallel: 1,       // 避免并发问题
  log: false,        // 生产环境关闭日志
  debug: false       // 生产环境关闭调试
});
```

### 错误处理模板
```javascript
creator.on('error', (error) => {
  console.error('Error:', error);
  cleanup();
});

creator.on('complete', () => {
  console.log('Success');
  cleanup();
});

function cleanup() {
  // 清理缓存等资源
  const cacheDir = './cache';
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }
}
```

### 资源检查模板
```javascript
function checkResources() {
  const resources = [
    './resources/image.png',
    './resources/video.mp4',
    './resources/audio.wav'
  ];
  
  for (const resource of resources) {
    if (!fs.existsSync(resource)) {
      console.error('Resource not found:', resource);
      return false;
    }
  }
  
  return true;
}

if (!checkResources()) {
  console.error('Missing resources');
  process.exit(1);
}
``` 