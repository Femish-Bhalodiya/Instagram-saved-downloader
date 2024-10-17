const { collectSavedPostUrls } = require('./collect-instagram-post-url');
const { getAllLinks } = require('./generate-cdn-links');
const { downloadVideo, createDownloadsFolder } = require('./download-video');
const path = require('path');

async function collectPostUrls() {
  try {
    return await collectSavedPostUrls();
  } catch (error) {
    console.error('Error collecting post URLs:', error);
    throw error;
  }
}

async function getCdnLinks(postUrls) {
  try {
    const urls = await getAllLinks(postUrls);
    return urls.filter((url) => url);
  } catch (error) {
    console.error('Error getting CDN links:', error);
    throw error;
  }
}

function ensureDownloadsFolder() {
  try {
    createDownloadsFolder();
  } catch (error) {
    console.error('Error creating downloads folder:', error);
    throw error;
  }
}

async function downloadSingleVideo(url, index) {
  const filePath = path.join(__dirname, `../downloads/video-${index}.mp4`);
  try {
    await downloadVideo(url, filePath);
    console.log(`Downloaded video ${index} to ${filePath}`);
  } catch (error) {
    console.error(`Error downloading video ${index}:`, error);
  }
}

async function downloadPosts() {
  try {
    const postUrls = await collectPostUrls();
    const urls = await getCdnLinks(postUrls);
    ensureDownloadsFolder();

    await Promise.all(urls.map(downloadSingleVideo));
  } catch (error) {
    console.error('Error in downloadPosts:', error);
  }
}

downloadPosts();
