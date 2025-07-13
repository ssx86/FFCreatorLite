const path = require('path');
const fs = require('fs-extra');
const os = require('os');

class TestSetup {
  constructor() {
    this.testId = Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    this.tempDir = path.join(os.tmpdir(), 'ffcreator-test', this.testId);
    this.outputDir = path.join(this.tempDir, 'output');
    this.cacheDir = path.join(this.tempDir, 'cache');
    this.createdDirectories = [];
    this.createdFiles = [];
  }

  async setup() {
    // Create temp directories
    await fs.ensureDir(this.tempDir);
    await fs.ensureDir(this.outputDir);
    await fs.ensureDir(this.cacheDir);

    this.createdDirectories.push(this.tempDir);
    return {
      outputDir: this.outputDir,
      cacheDir: this.cacheDir,
      tempDir: this.tempDir,
    };
  }

  getCreatorConfig(options = {}) {
    return {
      cacheDir: this.cacheDir,
      outputDir: this.outputDir,
      width: options.width || 640,
      height: options.height || 360,
      log: false, // Disable logging for tests
      fps: options.fps || 25,
      ...options,
    };
  }

  trackFile(filePath) {
    this.createdFiles.push(filePath);
  }

  async cleanup() {
    // Clean up all created files and directories
    try {
      if (await fs.pathExists(this.tempDir)) {
        await fs.remove(this.tempDir);
      }

      // Clean up any files that might have been created in workspace
      const workspaceRoot = path.resolve('.');
      const files = await fs.readdir(workspaceRoot);

      for (const file of files) {
        if (file.endsWith('.mp4') && file.length > 10) {
          const filePath = path.join(workspaceRoot, file);
          try {
            await fs.remove(filePath);
            console.log(`Cleaned up stray file: ${file}`);
          } catch (error) {
            console.warn(`Could not clean up ${file}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.warn('Cleanup warning:', error.message);
    }
  }

  // Safe creator destroyer that handles null references
  destroyCreator(creator) {
    if (!creator) return;

    try {
      // Manually clean up scenes first
      if (creator.scenes) {
        creator.scenes.forEach(scene => {
          try {
            if (scene && typeof scene.destroy === 'function') {
              scene.destroy();
            }
          } catch (error) {
            console.warn('Scene destroy warning:', error.message);
          }
        });
      }

      // Then destroy the creator
      if (typeof creator.destroy === 'function') {
        creator.destroy();
      }
    } catch (error) {
      console.warn('Creator destroy warning:', error.message);
    }
  }

  // Create a promise that resolves when video rendering completes
  renderVideo(creator, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Video rendering timed out after ${timeout}ms`));
      }, timeout);

      let hasResolved = false;

      const resolveOnce = result => {
        if (hasResolved) return;
        hasResolved = true;
        clearTimeout(timeoutId);
        resolve(result);
      };

      creator.on('complete', event => {
        this.trackFile(event.output);
        resolveOnce({
          success: true,
          outputPath: event.output,
          event,
        });
      });

      creator.on('error', error => {
        resolveOnce({
          success: false,
          error: error.error || error.message || error,
          outputPath: null,
        });
      });

      try {
        creator.start();
      } catch (error) {
        resolveOnce({
          success: false,
          error: error.message,
          outputPath: null,
        });
      }
    });
  }

  // Check if video exists and is valid
  async validateVideo(videoPath) {
    try {
      if (!videoPath || !(await fs.pathExists(videoPath))) {
        return { valid: false, error: 'Video file does not exist' };
      }

      const stats = await fs.stat(videoPath);
      if (!stats.isFile() || stats.size === 0) {
        return { valid: false, error: 'Video file is empty or invalid' };
      }

      return { valid: true, size: stats.size };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Get test video path (using existing example videos)
  getTestVideoPath() {
    const videoPath = path.join(__dirname, '../../examples/assets/video/video1.mp4');
    return videoPath;
  }

  // Check if test video exists
  async hasTestVideo() {
    const videoPath = this.getTestVideoPath();
    return await fs.pathExists(videoPath);
  }
}

module.exports = TestSetup;
