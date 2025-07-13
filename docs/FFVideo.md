# FFVideo - 视频组件

## 概述

FFVideo 是用于在场景中播放视频文件的组件，支持视频播放、循环、裁剪等功能。

## 构造函数

```javascript
const video = new FFVideo(options);
```

### 配置选项 (options)

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | String | 必填 | 视频文件路径 |
| `x` | Number | 0 | X坐标位置 |
| `y` | Number | 0 | Y坐标位置 |
| `width` | Number | 原始宽度 | 显示宽度 |
| `height` | Number | 原始高度 | 显示高度 |
| `duration` | Number | 必填 | 播放时长（秒） |
| `appearTime` | Number | 0 | 开始播放时间（秒） |
| `loop` | Boolean | false | 是否循环播放 |
| `delay` | Number | 0 | 播放延迟（秒） |
| `clipStartTime` | Number | 0 | 裁剪开始时间（秒） |
| `clipEndTime` | Number | 视频结束 | 裁剪结束时间（秒） |

## 主要方法

### 基本设置

#### setLoop(loop)
设置是否循环播放
```javascript
video.setLoop(true);  // 循环播放
video.setLoop(false); // 不循环播放
```

#### setDelay(delay)
设置播放延迟
```javascript
video.setDelay(2); // 延迟2秒开始播放
```

## 完整示例

### 基本视频播放
```javascript
const { FFCreator, FFScene, FFVideo } = require('./lib');

const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  outputDir: './output'
});

const scene = new FFScene();
scene.setBgColor('#000000');
scene.setDuration(5);

// 基本视频播放
const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 5,      // 重要：必须设置播放时长
  appearTime: 0,    // 重要：必须设置开始时间
  loop: false
});

scene.addChild(video);
creator.addChild(scene);
```

### 视频循环播放
```javascript
const video = new FFVideo({
  path: './resources/short-video.mp4',
  x: 640,
  y: 360,
  width: 600,
  height: 400,
  duration: 8,      // 播放8秒
  appearTime: 0,
  loop: true        // 循环播放（如果原视频不足8秒）
});
```

### 视频裁剪
```javascript
const video = new FFVideo({
  path: './resources/long-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 3,
  appearTime: 0,
  clipStartTime: 10,  // 从第10秒开始
  clipEndTime: 13     // 到第13秒结束
});
```

### 延迟播放
```javascript
const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 3,
  appearTime: 2,      // 场景开始2秒后开始播放
  delay: 1            // 额外延迟1秒
});
```

## 多场景视频示例

```javascript
const { FFCreator, FFScene, FFVideo } = require('./lib');

async function createMultiSceneVideo() {
  const creator = new FFCreator({
    width: 1280,
    height: 720,
    fps: 25,
    outputDir: './output',
    parallel: 1
  });

  // 场景1：视频正常播放
  const scene1 = new FFScene();
  scene1.setBgColor('#000000');
  scene1.setDuration(5);

  const video1 = new FFVideo({
    path: './resources/test-video.mp4',
    x: 640,
    y: 360,
    width: 800,
    height: 450,
    duration: 5,
    appearTime: 0,
    loop: false
  });

  scene1.addChild(video1);
  creator.addChild(scene1);

  // 场景2：视频循环播放
  const scene2 = new FFScene();
  scene2.setBgColor('#1a1a1a');
  scene2.setDuration(3);

  const video2 = new FFVideo({
    path: './resources/test-video.mp4',
    x: 640,
    y: 360,
    width: 600,
    height: 338,
    duration: 3,
    appearTime: 0,
    loop: true
  });

  scene2.addChild(video2);
  creator.addChild(scene2);

  creator.setOutput('./output/multi-scene-video.mp4');
  creator.start();
}

createMultiSceneVideo();
```

## 常见问题及解决方案

### 1. 视频显示为静止帧

**问题**：生成的视频只显示视频的第一帧，不播放动画

**原因**：缺少 `duration` 和 `appearTime` 参数

**解决方案**：
```javascript
// ❌ 错误的写法
const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450
  // 缺少 duration 和 appearTime
});

// ✅ 正确的写法
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

### 2. 视频播放不完整

**问题**：视频播放时间不够或被截断

**解决方案**：
```javascript
// 确保场景时长 >= 视频时长
const scene = new FFScene();
scene.setDuration(5); // 场景5秒

const video = new FFVideo({
  path: './resources/test-video.mp4',
  duration: 5,      // 视频播放5秒，与场景时长一致
  appearTime: 0
});
```

### 3. 视频文件格式不支持

**问题**：某些视频格式无法播放

**解决方案**：
```javascript
// 推荐使用的视频格式
// - MP4 (H.264编码)
// - WebM
// - AVI
// - MOV

// 如果视频格式有问题，可以预先转换
const ffmpeg = require('fluent-ffmpeg');
ffmpeg('./input.avi')
  .output('./output.mp4')
  .run();
```

### 4. 视频尺寸和画面不匹配

**问题**：视频变形或尺寸不合适

**解决方案**：
```javascript
// 保持视频比例
const originalWidth = 1920;
const originalHeight = 1080;
const aspectRatio = originalWidth / originalHeight;

const displayWidth = 800;
const displayHeight = displayWidth / aspectRatio;

const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: displayWidth,
  height: displayHeight,
  duration: 5,
  appearTime: 0
});
```

### 5. 循环播放设置

**问题**：循环播放不生效

**解决方案**：
```javascript
// 如果原视频长度 < duration，需要设置 loop: true
const video = new FFVideo({
  path: './resources/short-video.mp4', // 假设只有2秒
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 6,      // 需要播放6秒
  appearTime: 0,
  loop: true        // 开启循环，视频会重复播放
});
```

## 最佳实践

### 1. 时长设置
```javascript
// 推荐：明确设置所有时间参数
const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 5,      // 播放时长
  appearTime: 0,    // 开始时间
  loop: false       // 循环设置
});
```

### 2. 性能优化
```javascript
// 对于大视频文件，考虑预处理
const video = new FFVideo({
  path: './resources/optimized-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 5,
  appearTime: 0,
  // 使用裁剪减少文件大小
  clipStartTime: 0,
  clipEndTime: 5
});
```

### 3. 错误处理
```javascript
const fs = require('fs');
const path = require('path');

const videoPath = './resources/test-video.mp4';

// 检查文件是否存在
if (!fs.existsSync(videoPath)) {
  console.error('Video file not found:', videoPath);
  return;
}

// 检查文件大小
const stats = fs.statSync(videoPath);
console.log('Video file size:', Math.round(stats.size / 1024), 'KB');

const video = new FFVideo({
  path: videoPath,
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 5,
  appearTime: 0
});
```

## 高级功能

### 视频动画
```javascript
const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 5,
  appearTime: 0
});

// 添加淡入效果
video.addEffect('fadeIn', 1.0, 0); // 1秒淡入

// 添加移动效果
video.addEffect('moveIn', 1.0, 0, { from: 'left' });
```

### 视频遮罩
```javascript
const video = new FFVideo({
  path: './resources/test-video.mp4',
  x: 640,
  y: 360,
  width: 800,
  height: 450,
  duration: 5,
  appearTime: 0
});

// 添加圆形遮罩
video.addFilter('mask', './resources/circle-mask.png');
``` 