const path = require('path');
const fs = require('fs-extra');
const ffprobe = require('ffmpeg-probe');

class TestUtils {
  constructor() {
    this.timeout = 30000; // 30 seconds timeout for video rendering
  }

  /**
   * Render a video using FFCreator and validate the output
   * @param {FFCreator} creator - The FFCreator instance to render
   * @returns {Promise<object>} - Result object with success status and output path
   */
  async renderAndValidate(creator) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Video rendering timed out'));
      }, this.timeout);

      let outputPath = null;

      creator.on('complete', event => {
        clearTimeout(timeout);
        outputPath = event.output;
        resolve({
          success: true,
          outputPath,
          event,
        });
      });

      creator.on('error', error => {
        clearTimeout(timeout);
        resolve({
          success: false,
          error: error.error || error,
          outputPath: null,
        });
      });

      try {
        creator.start();
      } catch (error) {
        clearTimeout(timeout);
        resolve({
          success: false,
          error: error.message,
          outputPath: null,
        });
      }
    });
  }

  /**
   * Check if a video file exists and is valid
   * @param {string} videoPath - Path to the video file
   * @returns {Promise<boolean>} - True if video exists and is valid
   */
  async videoExists(videoPath) {
    try {
      if (!(await fs.pathExists(videoPath))) {
        return false;
      }

      const stats = await fs.stat(videoPath);
      return stats.isFile() && stats.size > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get video duration using ffprobe
   * @param {string} videoPath - Path to the video file
   * @returns {Promise<number>} - Video duration in seconds
   */
  async getVideoDuration(videoPath) {
    try {
      const probe = await ffprobe(videoPath);
      return probe.format.duration || 0;
    } catch (error) {
      console.error('Error getting video duration:', error);
      return 0;
    }
  }

  /**
   * Get video dimensions using ffprobe
   * @param {string} videoPath - Path to the video file
   * @returns {Promise<object>} - Object with width and height
   */
  async getVideoDimensions(videoPath) {
    try {
      const probe = await ffprobe(videoPath);
      const videoStream = probe.streams.find(stream => stream.codec_type === 'video');
      return {
        width: videoStream.width || 0,
        height: videoStream.height || 0,
      };
    } catch (error) {
      console.error('Error getting video dimensions:', error);
      return { width: 0, height: 0 };
    }
  }

  /**
   * Get video frame rate using ffprobe
   * @param {string} videoPath - Path to the video file
   * @returns {Promise<number>} - Video frame rate (fps)
   */
  async getVideoFrameRate(videoPath) {
    try {
      const probe = await ffprobe(videoPath);
      const videoStream = probe.streams.find(stream => stream.codec_type === 'video');

      if (videoStream.r_frame_rate) {
        const [numerator, denominator] = videoStream.r_frame_rate.split('/');
        return parseFloat(numerator) / parseFloat(denominator);
      }

      return 0;
    } catch (error) {
      console.error('Error getting video frame rate:', error);
      return 0;
    }
  }

  /**
   * Check if video has audio track
   * @param {string} videoPath - Path to the video file
   * @returns {Promise<boolean>} - True if video has audio
   */
  async hasAudioTrack(videoPath) {
    try {
      const probe = await ffprobe(videoPath);
      return probe.streams.some(stream => stream.codec_type === 'audio');
    } catch (error) {
      console.error('Error checking audio track:', error);
      return false;
    }
  }

  /**
   * Validate video properties against expected values
   * @param {string} videoPath - Path to the video file
   * @param {object} expected - Expected properties
   * @returns {Promise<object>} - Validation result
   */
  async validateVideoProperties(videoPath, expected = {}) {
    try {
      const exists = await this.videoExists(videoPath);
      if (!exists) {
        return { valid: false, error: 'Video file does not exist' };
      }

      const results = {};

      if (expected.duration !== undefined) {
        results.duration = await this.getVideoDuration(videoPath);
      }

      if (expected.width !== undefined || expected.height !== undefined) {
        const dimensions = await this.getVideoDimensions(videoPath);
        results.width = dimensions.width;
        results.height = dimensions.height;
      }

      if (expected.fps !== undefined) {
        results.fps = await this.getVideoFrameRate(videoPath);
      }

      if (expected.hasAudio !== undefined) {
        results.hasAudio = await this.hasAudioTrack(videoPath);
      }

      return { valid: true, results };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Clean up test directories
   * @param {string[]} directories - Array of directory paths to clean
   */
  async cleanupDirectories(directories) {
    for (const dir of directories) {
      try {
        if (await fs.pathExists(dir)) {
          await fs.remove(dir);
        }
      } catch (error) {
        console.warn(`Warning: Could not clean directory ${dir}:`, error.message);
      }
    }
  }

  /**
   * Create a mock video file for testing
   * @param {string} outputPath - Path where to create the mock video
   * @param {object} options - Video options (duration, width, height, fps)
   */
  async createMockVideo(outputPath, options = {}) {
    const { duration = 5, width = 640, height = 360, fps = 25, color = 'blue' } = options;

    const ffmpeg = require('fluent-ffmpeg');

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(`color=${color}:size=${width}x${height}:duration=${duration}:rate=${fps}`)
        .inputFormat('lavfi')
        .outputOptions(['-c:v libx264', '-pix_fmt yuv420p'])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', err => reject(err))
        .run();
    });
  }

  /**
   * Compare two video files and check if they are different
   * @param {string} video1Path - Path to first video
   * @param {string} video2Path - Path to second video
   * @returns {Promise<boolean>} - True if videos are different
   */
  async compareVideos(video1Path, video2Path) {
    try {
      const [stats1, stats2] = await Promise.all([fs.stat(video1Path), fs.stat(video2Path)]);

      // Simple comparison by file size (for basic testing)
      return stats1.size !== stats2.size;
    } catch (error) {
      console.error('Error comparing videos:', error);
      return false;
    }
  }

  /**
   * Wait for a specified amount of time
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a unique filename for test output
   * @param {string} prefix - Filename prefix
   * @param {string} extension - File extension
   * @returns {string} - Unique filename
   */
  generateTestFilename(prefix = 'test', extension = '.mp4') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}${extension}`;
  }

  /**
   * Setup test assets directory
   * @param {string} testDir - Test directory path
   */
  async setupTestAssets(testDir) {
    const assetsDir = path.join(testDir, 'assets');
    const videoDir = path.join(assetsDir, 'video');

    // Ensure directories exist
    await fs.ensureDir(videoDir);

    // Create a simple test video if it doesn't exist
    const testVideoPath = path.join(videoDir, 'video1.mp4');
    if (!(await fs.pathExists(testVideoPath))) {
      await this.createMockVideo(testVideoPath, {
        duration: 10,
        width: 640,
        height: 360,
        color: 'red',
      });
    }

    return {
      assetsDir,
      videoDir,
      testVideoPath,
    };
  }
}

module.exports = TestUtils;
