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
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));

    // Set admin cookie directly
    console.log('Setting admin session cookie...');
    const adminSession = {
      id: 'admin-1',
      email: 'admin@trifit.com',
      name: 'Executive Admin',
      role: 'ADMIN',
      branchId: null,
      branchName: 'All Branches (Network)',
      branchCity: 'Karachi & Islamabad',
    };

    await page.setCookie({
      name: 'apollo_session',
      value: encodeURIComponent(JSON.stringify(adminSession)),
      domain: 'localhost',
      path: '/',
    });

    // 1. Capture Dark Mode
    console.log('Navigating to /admin/equipment (Dark Mode)...');
    await page.goto('http://localhost:3000/admin/equipment', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('apollo-theme', 'dark');
    });
    // Wait for animations (bars, counters)
    await new Promise(r => setTimeout(r, 1800));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_equipment_dark.png`,
      fullPage: false,
    });
    console.log('Saved admin_equipment_dark.png');

    // 2. Capture Light Mode
    console.log('Switching to Light Mode...');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('apollo-theme', 'light');
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_equipment_light.png`,
      fullPage: false,
    });
    console.log('Saved admin_equipment_light.png');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

capture();
