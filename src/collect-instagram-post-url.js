const puppeteer = require('puppeteer');
require('dotenv').config({ override: true, debug: true });

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const browserPath = process.env.BROWSER_PATH;

async function collectSavedPostUrls() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: browserPath,
  });
  const page = await browser.newPage();

  try {
    // Go to Instagram's login page
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

    // Login to your account
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Go to the saved posts page
    await page.goto(`https://www.instagram.com/${username}/saved/all-posts/`, {
      waitUntil: 'networkidle2',
    });

    // Scroll to the bottom of the page to load all saved posts
    await autoScroll(page);

    // Get links of all saved posts
    const savedPostsLinks = await page.evaluate(() => {
      const link = [];
      const posts = document.querySelectorAll('a[href^="/p/"]');
      for (const post of posts) {
        link.push(post.href);
      }
      return link;
    });
    return savedPostsLinks;
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await browser.close();
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = { collectSavedPostUrls };
