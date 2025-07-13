# FFCreator - 主创建器

## 概述

FFCreator 是整个视频创建流程的核心控制器，负责管理视频项目的全局配置、场景管理和最终输出。

## 构造函数

```javascript
const creator = new FFCreator(options);
```

### 配置选项 (options)

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | Number | 1280 | 视频宽度（像素） |
| `height` | Number | 720 | 视频高度（像素） |
| `fps` | Number | 25 | 帧率 |
| `outputDir` | String | './output' | 输出目录 |
| `cacheDir` | String | './cache' | 缓存目录 |
| `parallel` | Number | 1 | 并行处理数量 |
| `log` | Boolean | false | 是否开启日志 |
| `debug` | Boolean | false | 是否开启调试模式 |

## 主要方法

### 场景管理

#### addChild(scene)
添加场景到创建器
```javascript
const scene = new FFScene();
creator.addChild(scene);
```

#### removeChild(scene)
移除场景
```javascript
creator.removeChild(scene);
```

### 输出设置

#### setOutput(path)
设置输出文件路径
```javascript
creator.setOutput('./output/my-video.mp4');
```

#### setOutputDir(dir)
设置输出目录
```javascript
creator.setOutputDir('./output');
```

### 生命周期控制

#### start()
开始视频生成
```javascript
creator.start();
```

#### stop()
停止视频生成
```javascript
creator.stop();
```

## 事件监听

### 进度事件
```javascript
creator.on('progress', (progress) => {
  console.log(`Progress: ${Math.round(progress * 100)}%`);
});
```

### 完成事件
```javascript
creator.on('complete', () => {
  console.log('Video generation completed!');
});
```

### 错误事件
```javascript
creator.on('error', (error) => {
  console.error('Error:', error);
});
```

### 开始事件
```javascript
creator.on('start', () => {
  console.log('Video generation started');
});
```

## 完整示例

```javascript
const { FFCreator, FFScene, FFImage } = require('./lib');

async function createVideo() {
  // 创建创建器实例
  const creator = new FFCreator({
    width: 1280,
    height: 720,
    fps: 25,
    outputDir: './output',
    cacheDir: './cache',
    parallel: 1,
    log: true
  });

  // 创建场景
  const scene = new FFScene();
  scene.setBgColor('#000000');
  scene.setDuration(3);

  // 添加图像
  const image = new FFImage({
    path: './resources/test-image.png',
    x: 640,
    y: 360,
    width: 400,
    height: 300
  });

  scene.addChild(image);
  creator.addChild(scene);

  // 设置输出文件
  creator.setOutput('./output/demo.mp4');

  // 监听事件
  creator.on('progress', (progress) => {
    console.log(`Progress: ${Math.round(progress * 100)}%`);
  });

  creator.on('complete', () => {
    console.log('✅ Video created successfully!');
  });

  creator.on('error', (error) => {
    console.error('❌ Error:', error);
  });

  // 开始生成
  creator.start();
}

createVideo();
```

## 最佳实践

### 1. 配置优化
```javascript
// 推荐配置（特别是Windows系统）
const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  parallel: 1,     // 避免并发问题
  log: false,      // 生产环境关闭日志
  debug: false     // 生产环境关闭调试
});
```

### 2. 错误处理
```javascript
creator.on('error', (error) => {
  console.error('Video generation failed:', error);
  // 清理资源
  creator.stop();
});
```

### 3. 资源管理
```javascript
// 确保目录存在
const fs = require('fs');
const outputDir = './output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
```

## 常见问题

### 1. 内存使用过多
- 降低分辨率
- 减少并行处理数量
- 优化图像和视频文件大小

### 2. 生成速度慢
- 使用 SSD 存储
- 优化 cacheDir 位置
- 减少复杂动画效果

### 3. Windows 字体问题
- 避免使用复杂的中文字体
- 使用系统默认字体
- 检查字体文件路径

### 4. FFmpeg 路径问题
```javascript
// 如果需要指定FFmpeg路径
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('/path/to/ffmpeg');
ffmpeg.setFfprobePath('/path/to/ffprobe');
``` 