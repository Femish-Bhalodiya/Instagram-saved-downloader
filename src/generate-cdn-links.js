const snapsave = require('snapsave-downloader');

async function generateCDNLink(url) {
  try {
    let links = await snapsave(url);
    return links?.data[0].url;
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

async function getAllLinks(postUrls) {
  const cdnUrls = await Promise.all(postUrls.map((url) => generateCDNLink(url)));
  return cdnUrls;
}

module.exports = { getAllLinks };
