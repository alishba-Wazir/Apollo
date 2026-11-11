import puppeteer from 'puppeteer-core';

const ARTIFACT_DIR = 'C:/Users/PMLS/.gemini/antigravity/brain/2e0ee44a-adfd-4a12-b3ca-3ef1228778aa';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    for (const item of [
      { url: 'http://localhost:3000/admin/revenue', name: 'step2_revenue_mobile' },
      { url: 'http://localhost:3000/admin/brain', name: 'step2_brain_mobile' },
    ]) {
      await page.goto(item.url, { waitUntil: 'networkidle0' });
      // Dark
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      });
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: `${ARTIFACT_DIR}/${item.name}_dark.png`, fullPage: false });

      // Light
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
      });
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: `${ARTIFACT_DIR}/${item.name}_light.png`, fullPage: false });
    }
  } finally {
    await browser.close();
  }
}
run();
