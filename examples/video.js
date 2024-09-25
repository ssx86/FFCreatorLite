const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFImage, FFText, FFVideo, FFCreator, FFGif } = require('../');

const createFFTask = () => {
  const img3 = path.join(__dirname, './assets/imgs/image2.gif');
  const font = path.join(__dirname, './assets/font/scsf.ttf');
  const video1 = path.join(__dirname, './assets/video/video3.mp4');

  const cacheDir = path.join(__dirname, './cache/');
  const outputDir = path.join(__dirname, './output/');

  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width: 1920,
    height: 1080,
    log: true,
    //audio,
  });

  // create FFScene
  const scene1 = new FFScene();

  const fvideo1 = new FFVideo({
    path: video1,
    audio: true,
    clipStartTime: 0,
    clipEndTime: 3,
    appearTime: 0,
    duration: 3,
    width: 100,
    height: 100,
  });
  scene1.addChild(fvideo1);

  const fvideo2 = new FFVideo({
    path: video1,
    audio: true,
    clipStartTime: 3,
    clipEndTime: 3.001,
    appearTime: 3,
    duration: 6,
    width: 100,
    height: 100,
  });
  scene1.addChild(fvideo2);

  const fimg3 = new FFGif({ path: img3, x: 100, y: 100, appearTime: 3, duration: 6 });
  scene1.addChild(fimg3);

  const text1 = new FFText({ text: 'FFVideo案例', font, x: 140, y: 100, fontSize: 42 });
  text1.setColor('#ffffff');
  text1.setBorder(5, '#000000');
  //text1.addEffect('fadeIn', 2, 1);
  scene1.addChild(text1);

  const fvideo3 = new FFVideo({
    path: video1,
    audio: true,
    clipStartTime: 3.001,
    clipEndTime: 12,
    appearTime: 6,
    duration: 15,
  });
  scene1.addChild(fvideo3);

  scene1.setDuration(15);
  creator.addChild(scene1);

  creator.start();
  creator.openLog();

  creator.on('start', () => {
    console.log(`FFCreatorLite start`);
  });

  creator.on('error', e => {
    console.log(`FFCreatorLite error:: \n ${e.error}`);
  });

  creator.on('progress', e => {
    console.log(colors.yellow(`FFCreatorLite progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreatorLite completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};

module.exports = () => startAndListen(() => FFCreatorCenter.addTask(createFFTask));
