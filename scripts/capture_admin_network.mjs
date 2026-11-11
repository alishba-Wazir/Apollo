import puppeteer from 'puppeteer-core';

const ARTIFACT_DIR = 'C:/Users/PMLS/.gemini/antigravity/brain/2e0ee44a-adfd-4a12-b3ca-3ef1228778aa';

async function capture() {
  console.log('Launching browser with Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });

    // Navigate to login page first to establish context
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 15000 });
    
    // Submit the form which defaults to admin@trifit.com / Password123!
    console.log('Submitting login form for Admin...');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1200));

    // 1. Capture Dark Mode
    console.log('Configuring Dark Mode...');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('apollo-theme', 'dark');
    });
    // Wait for animations (countup, line chart self-draw, circular dials)
    await new Promise(r => setTimeout(r, 1800));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_network_dark.png`,
      fullPage: false,
    });
    console.log('Saved admin_network_dark.png');

    // 1b. Capture Branch Switcher Dropdown Open
    console.log('Opening branch switcher dropdown...');
    // Find and click the branch switcher button in header
    const branchBtn = await page.$('header .relative button');
    if (branchBtn) {
      await branchBtn.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({
        path: `${ARTIFACT_DIR}/admin_network_switcher_updated.png`,
        fullPage: false,
      });
      console.log('Saved admin_network_switcher_updated.png');
      // Click again or click backdrop to close
      await branchBtn.click();
      await new Promise(r => setTimeout(r, 300));
    } else {
      console.log('Branch button not found');
    }

    // 1c. Capture Network Table with all 5 branches and area under branch name
    console.log('Scrolling to Network table...');
    await page.evaluate(() => {
      const table = document.querySelector('table');
      if (table) {
        table.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_network_table_updated.png`,
      fullPage: false,
    });
    console.log('Saved admin_network_table_updated.png');

    // 1d. Capture Health Score Hover Tooltip
    console.log('Hovering over health score...');
    const scoreElement = await page.$('.group\\/score');
    if (scoreElement) {
      await scoreElement.hover();
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({
        path: `${ARTIFACT_DIR}/admin_network_health_hover.png`,
        fullPage: false,
      });
      console.log('Saved admin_network_health_hover.png');
    }

    // 2. Capture Light Mode
    console.log('Switching to Light Mode...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('apollo-theme', 'light');
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_network_light.png`,
      fullPage: false,
    });
    console.log('Saved admin_network_light.png');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

capture();
