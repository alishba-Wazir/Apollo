import puppeteer from 'puppeteer-core';

const ARTIFACT_DIR = 'C:/Users/PMLS/.gemini/antigravity/brain/2e0ee44a-adfd-4a12-b3ca-3ef1228778aa';

async function runCapture() {
  console.log('Launching browser with Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. Authenticate via login
    console.log('Authenticating via login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));

    // Helper to capture a page in dark & light
    async function capturePage(url, baseName, isMobile = false) {
      const width = isMobile ? 390 : 1440;
      const height = isMobile ? 844 : 1100;
      await page.setViewport({ width, height, deviceScaleFactor: 2 });

      // Navigate
      console.log(`Navigating to ${url} (${isMobile ? 'Mobile 390px' : 'Desktop 1440px'})...`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

      // DARK MODE
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
        localStorage.setItem('apollo-theme', 'dark');
      });
      await new Promise(r => setTimeout(r, 2000));
      const darkFile = `${ARTIFACT_DIR}/${baseName}_${isMobile ? 'mobile' : 'desktop'}_dark.png`;
      await page.screenshot({ path: darkFile, fullPage: false });
      console.log(`Saved ${darkFile}`);

      // LIGHT MODE
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('apollo-theme', 'light');
      });
      await new Promise(r => setTimeout(r, 2000));
      const lightFile = `${ARTIFACT_DIR}/${baseName}_${isMobile ? 'mobile' : 'desktop'}_light.png`;
      await page.screenshot({ path: lightFile, fullPage: false });
      console.log(`Saved ${lightFile}`);
    }

    // Capture /admin Desktop
    await capturePage('http://localhost:3000/admin', 'step2_admin', false);
    // Capture /admin Mobile
    await capturePage('http://localhost:3000/admin', 'step2_admin', true);

    // Capture /admin/revenue Desktop
    await capturePage('http://localhost:3000/admin/revenue', 'step2_revenue', false);

    // Capture /admin/brain Desktop
    await capturePage('http://localhost:3000/admin/brain', 'step2_brain', false);

    // Capture /admin/winback-results Desktop
    await capturePage('http://localhost:3000/admin/winback-results', 'step2_winback', false);

    console.log('All Step 2 screenshots captured successfully!');
  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    await browser.close();
  }
}

runCapture();
