# FFImage - 图像组件

## 概述

FFImage 是用于在场景中显示图像的组件，支持多种图像格式和动画效果。

## 构造函数

```javascript
const image = new FFImage(options);
```

### 配置选项 (options)

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | String | 必填 | 图像文件路径 |
| `x` | Number | 0 | X坐标位置 |
| `y` | Number | 0 | Y坐标位置 |
| `width` | Number | 原始宽度 | 显示宽度 |
| `height` | Number | 原始高度 | 显示高度 |
| `duration` | Number | 场景时长 | 显示时长（秒） |
| `appearTime` | Number | 0 | 开始显示时间（秒） |
| `scale` | Number | 1 | 缩放比例 |
| `rotate` | Number | 0 | 旋转角度 |
| `opacity` | Number | 1 | 透明度 (0-1) |

## 主要方法

### 基本设置

#### setPath(path)
设置图像文件路径
```javascript
image.setPath('./resources/new-image.png');
```

#### setXY(x, y)
设置位置
```javascript
image.setXY(640, 360);
```

#### setWH(width, height)
设置尺寸
```javascript
image.setWH(400, 300);
```

#### setScale(scale)
设置缩放比例
```javascript
image.setScale(1.5); // 放大1.5倍
```

#### setRotate(angle)
设置旋转角度
```javascript
image.setRotate(45); // 顺时针旋转45度
```

## 完整示例

### 基本图像显示
```javascript
const { FFCreator, FFScene, FFImage } = require('./lib');

const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  outputDir: './output'
});

const scene = new FFScene();
scene.setBgColor('#f0f0f0');
scene.setDuration(5);

// 基本图像显示
const image = new FFImage({
  path: './resources/test-image.png',
  x: 640,
  y: 360,
  width: 400,
  height: 300,
  duration: 5,
  appearTime: 0
});

scene.addChild(image);
creator.addChild(scene);
```

### 图像动画
```javascript
const image = new FFImage({
  path: './resources/logo.png',
  x: 640,
  y: 360,
  width: 200,
  height: 200,
  duration: 3,
  appearTime: 0
});

// 添加淡入效果
image.addAnimate({
  from: { opacity: 0 },
  to: { opacity: 1 },
  time: 1,
  delay: 0
});

// 添加缩放效果
image.addAnimate({
  from: { scale: 0.5 },
  to: { scale: 1 },
  time: 1,
  delay: 0
});
```

### 多图像布局
```javascript
const scene = new FFScene();
scene.setBgColor('#2c3e50');
scene.setDuration(6);

// 背景图像
const background = new FFImage({
  path: './resources/background.jpg',
  x: 0,
  y: 0,
  width: 1280,
  height: 720,
  duration: 6,
  appearTime: 0
});

// 左侧图像
const leftImage = new FFImage({
  path: './resources/left-image.png',
  x: 320,
  y: 360,
  width: 300,
  height: 200,
  duration: 6,
  appearTime: 1
});

// 右侧图像
const rightImage = new FFImage({
  path: './resources/right-image.png',
  x: 960,
  y: 360,
  width: 300,
  height: 200,
  duration: 6,
  appearTime: 2
});

scene.addChild(background);
scene.addChild(leftImage);
scene.addChild(rightImage);
```

### 图像序列动画
```javascript
const images = [
  './resources/frame1.png',
  './resources/frame2.png',
  './resources/frame3.png',
  './resources/frame4.png'
];

const scene = new FFScene();
scene.setBgColor('#000000');
scene.setDuration(4);

images.forEach((imagePath, index) => {
  const image = new FFImage({
    path: imagePath,
    x: 640,
    y: 360,
    width: 400,
    height: 300,
    duration: 1,
    appearTime: index // 每张图显示1秒
  });
  
  scene.addChild(image);
});
```

## 支持的图像格式

- PNG
- JPEG/JPG
- GIF (静态)
- BMP
- TIFF
- WebP

## 常见问题及解决方案

### 1. 图像不显示

**问题**：图像文件存在但不显示

**解决方案**：
```javascript
const fs = require('fs');

// 检查文件是否存在
const imagePath = './resources/test-image.png';
if (!fs.existsSync(imagePath)) {
  console.error('Image file not found:', imagePath);
  return;
}

// 确保设置了正确的时长
const image = new FFImage({
  path: imagePath,
  x: 640,
  y: 360,
  width: 400,
  height: 300,
  duration: 5,      // 必须设置显示时长
  appearTime: 0     // 必须设置开始时间
});
```

### 2. 图像变形

**问题**：图像宽高比不正确导致变形

**解决方案**：
```javascript
// 保持原始比例
const originalWidth = 800;
const originalHeight = 600;
const aspectRatio = originalWidth / originalHeight;

const displayWidth = 400;
const displayHeight = displayWidth / aspectRatio;

const image = new FFImage({
  path: './resources/test-image.png',
  x: 640,
  y: 360,
  width: displayWidth,
  height: displayHeight,
  duration: 5,
  appearTime: 0
});
```

### 3. 图像位置超出画面

**问题**：图像显示在画面外

**解决方案**：
```javascript
// 确保图像中心点在画面内
const imageWidth = 400;
const imageHeight = 300;
const videoWidth = 1280;
const videoHeight = 720;

const image = new FFImage({
  path: './resources/test-image.png',
  x: Math.min(Math.max(imageWidth/2, 640), videoWidth - imageWidth/2),
  y: Math.min(Math.max(imageHeight/2, 360), videoHeight - imageHeight/2),
  width: imageWidth,
  height: imageHeight,
  duration: 5,
  appearTime: 0
});
```

### 4. 图像加载性能问题

**问题**：大图像文件导致处理缓慢

**解决方案**：
```javascript
// 1. 优化图像文件大小
// 2. 使用适当的分辨率
// 3. 预处理图像

const image = new FFImage({
  path: './resources/optimized-image.png', // 使用优化后的图像
  x: 640,
  y: 360,
  width: 400,
  height: 300,
  duration: 5,
  appearTime: 0
});
```

## 最佳实践

### 1. 图像尺寸优化
```javascript
// 推荐：使用适当的图像尺寸
const image = new FFImage({
  path: './resources/image.png',
  x: 640,
  y: 360,
  width: 400,    // 不超过视频宽度的1/2
  height: 300,   // 不超过视频高度的1/2
  duration: 5,
  appearTime: 0
});
```

### 2. 图像格式选择
```javascript
// PNG: 支持透明背景，质量高但文件大
// JPEG: 文件小但不支持透明背景
// WebP: 现代格式，文件小质量高

// 推荐用法：
// - 需要透明背景：使用 PNG
// - 照片类图像：使用 JPEG
// - 现代浏览器：使用 WebP
```

### 3. 图像层次管理
```javascript
// 按显示顺序添加图像
scene.addChild(backgroundImage);  // 背景层
scene.addChild(contentImage);     // 内容层
scene.addChild(overlayImage);     // 覆盖层
```

### 4. 动画效果
```javascript
const image = new FFImage({
  path: './resources/logo.png',
  x: 640,
  y: 360,
  width: 200,
  height: 200,
  duration: 3,
  appearTime: 0
});

// 推荐：使用简单的动画效果
image.addAnimate({
  from: { opacity: 0, scale: 0.8 },
  to: { opacity: 1, scale: 1 },
  time: 1,
  delay: 0,
  ease: 'easeInOut'
});
```

## 高级功能

### 图像滤镜
```javascript
const image = new FFImage({
  path: './resources/image.png',
  x: 640,
  y: 360,
  width: 400,
  height: 300,
  duration: 5,
  appearTime: 0
});

// 添加模糊效果
image.addFilter('blur', 5);

// 添加亮度调整
image.addFilter('brightness', 1.2);

// 添加对比度调整
image.addFilter('contrast', 1.1);
```

### 图像遮罩
```javascript
const image = new FFImage({
  path: './resources/image.png',
  x: 640,
  y: 360,
  width: 400,
  height: 300,
  duration: 5,
  appearTime: 0
});

// 添加圆形遮罩
image.addFilter('mask', './resources/circle-mask.png');
```

### 图像组合
```javascript
const imageGroup = [];

// 创建图像组
for (let i = 0; i < 4; i++) {
  const image = new FFImage({
    path: `./resources/image${i+1}.png`,
    x: 320 + (i % 2) * 640,
    y: 180 + Math.floor(i / 2) * 360,
    width: 300,
    height: 200,
    duration: 5,
    appearTime: i * 0.5
  });
  
  imageGroup.push(image);
  scene.addChild(image);
}
``` 