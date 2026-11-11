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
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    // 1. Desk page (Pardah Mode: ACTIVE clean verification)
    await page.goto('http://localhost:3000/branch/desk', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/clean_branch_desk.png`, fullPage: false });

    // 2. Admin page (zero sample data pills)
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/clean_admin_dashboard.png`, fullPage: false });

    // 3. Admin Revenue (clean charts & compliance)
    await page.goto('http://localhost:3000/admin/revenue', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/clean_admin_revenue.png`, fullPage: false });

    console.log('Clean enterprise screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run();
