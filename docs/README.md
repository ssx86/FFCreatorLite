# FFCreatorLite 使用文档

## 项目概述

FFCreatorLite 是一个基于 Node.js 的轻量级视频创建库，支持图像、视频、文本、音频等多种媒体元素的组合和动画效果。

## 核心组件

### 1. FFCreator - 主创建器
- [FFCreator 详细文档](./FFCreator.md)
- 负责整个视频项目的配置和管理
- 控制输出格式、分辨率、帧率等参数

### 2. FFScene - 场景组件
- [FFScene 详细文档](./FFScene.md)
- 视频的基本单元，包含背景、元素和时长
- 支持场景间的转场效果

### 3. 媒体元素组件
- [FFImage 详细文档](./FFImage.md) - 图像元素
- [FFVideo 详细文档](./FFVideo.md) - 视频元素
- [FFText 详细文档](./FFText.md) - 文本元素
- [FFAudio 详细文档](./FFAudio.md) - 音频元素

### 4. 动画和效果
- [动画系统文档](./Animations.md)
- [转场效果文档](./Transitions.md)

## 快速开始

### 基本用法
```javascript
const { FFCreator, FFScene, FFImage } = require('./lib');

// 创建创建器实例
const creator = new FFCreator({
  width: 1280,
  height: 720,
  fps: 25,
  outputDir: './output'
});

// 创建场景
const scene = new FFScene();
scene.setDuration(3);
scene.setBgColor('#000000');

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

// 设置输出并开始
creator.setOutput('./output/demo.mp4');
creator.start();
```

## 示例项目

### 完整演示
- [complete-demo.js](../complete-demo.js) - 完整的视频创建演示
- [video-test-improved.js](../video-test-improved.js) - 视频播放测试

### 问题解决
- [常见问题解答](./FAQ.md)
- [错误处理指南](./ErrorHandling.md)

## 支持的功能

- ✅ 图像显示和动画
- ✅ 视频播放和循环
- ✅ 文本渲染（需要字体配置）
- ✅ 音频背景音乐
- ✅ 动画效果（淡入淡出、移动、缩放等）
- ✅ 转场效果
- ✅ 多场景组合

## 技术要求

- Node.js 12+
- FFmpeg 已安装并可访问
- 支持的操作系统：Windows、macOS、Linux

## 注意事项

### Windows 系统
- 字体配置问题：建议避免使用复杂的中文字体
- 路径问题：使用正斜杠或转义反斜杠
- FFmpeg 路径：确保 FFmpeg 在系统 PATH 中

### 性能优化
- 使用 `parallel: 1` 避免并发问题
- 合理设置视频分辨率和帧率
- 优化图像和视频文件大小 