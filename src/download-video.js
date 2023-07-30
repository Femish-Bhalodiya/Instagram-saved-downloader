const axios = require('axios');
const fs = require('fs');
const path = require('path');

const createDownloadsFolder = () => {
  const folderPath = path.join(__dirname, '../downloads');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

const downloadVideo = async (videoUrl, downloadPath) => {
  try {
    const response = await axios.get(videoUrl, { responseType: 'stream' });

    response.data.pipe(fs.createWriteStream(downloadPath));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        console.log('Video downloaded successfully!');
        resolve();
      });

      response.data.on('error', (err) => {
        console.error('Error downloading the video:', err.message);
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error fetching the video:', error.message);
    throw error;
  }
};

module.exports = { downloadVideo, createDownloadsFolder };
