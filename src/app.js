const { collectSavedPostUrls } = require('./collect-instagram-post-url');
const { getAllLinks } = require('./generate-cdn-links');
const { downloadVideo, createDownloadsFolder } = require('./download-video');
const path = require('path');

async function downloadPosts() {
  const postUrls = await collectSavedPostUrls();
  const urls = (await getAllLinks(postUrls)).filter((url) => url);

  createDownloadsFolder();

  await Promise.all(
    urls.map((url, index) => {
      const filePath = path.join(__dirname, `../downloads/video-${index}.mp4`);
      return downloadVideo(url, filePath);
    })
  );
}

downloadPosts();
