# FFScene - 场景组件

## 概述

FFScene 是视频的基本构建单元，每个场景包含一个背景和多个媒体元素（图像、视频、文本等）。场景按顺序播放，形成完整的视频。

## 构造函数

```javascript
const scene = new FFScene();
```

## 主要方法

### 基本设置

#### setDuration(duration)
设置场景持续时间（秒）
```javascript
scene.setDuration(3); // 3秒
```

#### setBgColor(color)
设置背景颜色
```javascript
scene.setBgColor('#000000'); // 黑色
scene.setBgColor('#ff0000'); // 红色
scene.setBgColor('rgba(255,0,0,0.5)'); // 半透明红色
```

#### setBackground(background)
设置背景图片
```javascript
const bg = new FFImage({
  path: './resources/background.jpg',
  x: 0,
  y: 0,
  width: 1280,
  height: 720
});
scene.setBackground(bg);
```

### 元素管理

#### addChild(element)
添加元素到场景
```javascript
const image = new FFImage({
  path: './resources/image.png',
  x: 100,
  y: 100
});
scene.addChild(image);
```

#### removeChild(element)
移除元素
```javascript
scene.removeChild(image);
```

### 转场效果

#### setTransition(type, duration)
设置场景转场效果
```javascript
scene.setTransition('fade', 1.0); // 淡入淡出，1秒
scene.setTransition('slideLeft', 0.5); // 左滑，0.5秒
```

## 支持的转场类型

| 转场类型 | 说明 |
|----------|------|
| `fade` | 淡入淡出 |
| `slideLeft` | 左滑 |
| `slideRight` | 右滑 |
| `slideUp` | 上滑 |
| `slideDown` | 下滑 |
| `zoom` | 缩放 |
| `rotate` | 旋转 |

## 完整示例

### 基本场景
```javascript
const { FFCreator, FFScene, FFImage } = require('./lib');

const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  outputDir: './output'
});

// 创建场景
const scene = new FFScene();
scene.setBgColor('#2c3e50');
scene.setDuration(5);

// 添加图像
const image = new FFImage({
  path: './resources/logo.png',
  x: 640,
  y: 360,
  width: 200,
  height: 200
});

scene.addChild(image);
creator.addChild(scene);
```

### 多元素场景
```javascript
const scene = new FFScene();
scene.setBgColor('#34495e');
scene.setDuration(4);

// 背景图片
const background = new FFImage({
  path: './resources/background.jpg',
  x: 0,
  y: 0,
  width: 1280,
  height: 720
});

// 主图片
const mainImage = new FFImage({
  path: './resources/main.png',
  x: 640,
  y: 360,
  width: 400,
  height: 300
});

// 文本
const text = new FFText({
  text: 'Hello World',
  x: 640,
  y: 100,
  fontSize: 48,
  color: '#ffffff'
});

// 添加所有元素
scene.addChild(background);
scene.addChild(mainImage);
scene.addChild(text);
```

### 带转场的场景
```javascript
const scene1 = new FFScene();
scene1.setBgColor('#e74c3c');
scene1.setDuration(3);
scene1.setTransition('fade', 1.0);

const scene2 = new FFScene();
scene2.setBgColor('#3498db');
scene2.setDuration(3);
scene2.setTransition('slideLeft', 0.5);

creator.addChild(scene1);
creator.addChild(scene2);
```

## 最佳实践

### 1. 场景时长设置
```javascript
// 推荐：每个场景至少2-3秒
scene.setDuration(3);

// 避免：过短的场景
scene.setDuration(0.5); // 可能导致视觉闪烁
```

### 2. 背景设置
```javascript
// 选项1：纯色背景（性能最好）
scene.setBgColor('#000000');

// 选项2：图片背景
const bg = new FFImage({
  path: './resources/bg.jpg',
  x: 0,
  y: 0,
  width: 1280,
  height: 720
});
scene.setBackground(bg);
```

### 3. 元素布局
```javascript
// 推荐：使用视频中心作为参考点
const centerX = 640;  // 1280 / 2
const centerY = 360;  // 720 / 2

const image = new FFImage({
  path: './resources/image.png',
  x: centerX,
  y: centerY,
  width: 400,
  height: 300
});
```

### 4. 转场效果使用
```javascript
// 推荐：适度使用转场
scene.setTransition('fade', 1.0);

// 避免：过长的转场时间
scene.setTransition('fade', 5.0); // 转场时间不应超过场景时长
```

## 常见问题

### 1. 场景时长和元素时长不匹配
```javascript
// 错误：元素时长超过场景时长
const scene = new FFScene();
scene.setDuration(3); // 场景3秒

const image = new FFImage({
  path: './resources/image.png',
  duration: 5 // 元素5秒，会被截断
});

// 正确：保持一致
const image = new FFImage({
  path: './resources/image.png',
  duration: 3 // 与场景时长一致
});
```

### 2. 元素位置超出画面
```javascript
// 错误：元素位置超出1280x720画面
const image = new FFImage({
  path: './resources/image.png',
  x: 1500, // 超出画面宽度
  y: 800   // 超出画面高度
});

// 正确：确保元素在画面内
const image = new FFImage({
  path: './resources/image.png',
  x: 640,  // 画面中心
  y: 360   // 画面中心
});
```

### 3. 背景色格式问题
```javascript
// 支持的格式
scene.setBgColor('#000000');        // 十六进制
scene.setBgColor('#000');           // 短格式
scene.setBgColor('black');          // 颜色名称
scene.setBgColor('rgb(0,0,0)');     // RGB格式
scene.setBgColor('rgba(0,0,0,0.5)'); // RGBA格式
```

## 高级功能

### 场景事件监听
```javascript
scene.on('start', () => {
  console.log('Scene started');
});

scene.on('complete', () => {
  console.log('Scene completed');
});

scene.on('error', (error) => {
  console.error('Scene error:', error);
});
```

### 动态元素控制
```javascript
const scene = new FFScene();
scene.setDuration(5);

// 在场景中间添加元素
setTimeout(() => {
  const lateImage = new FFImage({
    path: './resources/late.png',
    x: 640,
    y: 360,
    appearTime: 2.5, // 2.5秒后出现
    duration: 2.5    // 显示2.5秒
  });
  scene.addChild(lateImage);
}, 100);
``` 