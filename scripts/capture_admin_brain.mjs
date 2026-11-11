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

    // 1. Capture Dark Mode (Tab 1: Recommendations)
    console.log('Navigating to /admin/brain (Dark Mode - Recommendations)...');
    await page.goto('http://localhost:3000/admin/brain', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('apollo-theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 1800));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_brain_dark.png`,
      fullPage: false,
    });
    console.log('Saved admin_brain_dark.png');

    // 2. Capture Light Mode
    console.log('Switching to Light Mode...');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('apollo-theme', 'light');
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_brain_light.png`,
      fullPage: false,
    });
    console.log('Saved admin_brain_light.png');

    // 3. Capture WhatsApp Communications Tab
    console.log('Capturing WhatsApp Tab in Dark Mode...');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('apollo-theme', 'dark');
    });
    // Click Tab 2
    const tabs = await page.$$('button');
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text && text.includes('WhatsApp Communications')) {
        await tab.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_brain_whatsapp_tab.png`,
      fullPage: false,
    });
    console.log('Saved admin_brain_whatsapp_tab.png');

    // 4. Capture Settings & Governance Tab
    console.log('Capturing Settings Tab in Dark Mode...');
    const allButtons = await page.$$('button');
    for (const btn of allButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('System Settings & Governance')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_brain_settings_tab.png`,
      fullPage: false,
    });
    console.log('Saved admin_brain_settings_tab.png');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

capture();
