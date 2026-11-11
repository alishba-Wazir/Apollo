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

    // 1. Authenticate via login page
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1200));

    // Configure Dark Mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('apollo-theme', 'dark');
    });

    // 1. Dashboard (/admin)
    console.log('Navigating to /admin (Dashboard)...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_01_dashboard.png`, fullPage: false });
    console.log('Saved nav_01_dashboard.png');

    // 2. Network & Branches (/admin/network)
    console.log('Navigating to /admin/network...');
    await page.goto('http://localhost:3000/admin/network', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_02_network.png`, fullPage: false });
    console.log('Saved nav_02_network.png');

    // 3. Members & Gate Access (/admin/members)
    console.log('Navigating to /admin/members...');
    await page.goto('http://localhost:3000/admin/members', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_03_members_directory.png`, fullPage: false });
    console.log('Saved nav_03_members_directory.png');

    // Members -> Live Turnstile Telemetry
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const turnstileBtn = btns.find(b => b.textContent && b.textContent.includes('Live Turnstile'));
      if (turnstileBtn) turnstileBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_03_members_turnstiles.png`, fullPage: false });
    console.log('Saved nav_03_members_turnstiles.png');

    // 4. Finance & IBFT OCR (/admin/finance)
    console.log('Navigating to /admin/finance...');
    await page.goto('http://localhost:3000/admin/finance', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_04_finance_ibft.png`, fullPage: false });
    console.log('Saved nav_04_finance_ibft.png');

    // 5. Classes & Trainers (/admin/classes)
    console.log('Navigating to /admin/classes...');
    await page.goto('http://localhost:3000/admin/classes', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_05_classes.png`, fullPage: false });
    console.log('Saved nav_05_classes.png');

    // Classes -> Trainer PT Roster
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trainerBtn = btns.find(b => b.textContent && b.textContent.includes('Trainer PT Roster'));
      if (trainerBtn) trainerBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_05_trainers_commission.png`, fullPage: false });
    console.log('Saved nav_05_trainers_commission.png');

    // 6. Apollo Brain AI CRM (/admin/brain)
    console.log('Navigating to /admin/brain...');
    await page.goto('http://localhost:3000/admin/brain', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_06_brain_radar.png`, fullPage: false });
    console.log('Saved nav_06_brain_radar.png');

    // 7. Settings (/admin/settings)
    console.log('Navigating to /admin/settings...');
    await page.goto('http://localhost:3000/admin/settings', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_07_settings_faith.png`, fullPage: false });
    console.log('Saved nav_07_settings_faith.png');

    // Settings -> Smart Hardware & Kiosks Tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hwBtn = btns.find(b => b.textContent && b.textContent.includes('Smart Hardware'));
      if (hwBtn) hwBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_07_settings_hardware.png`, fullPage: false });
    console.log('Saved nav_07_settings_hardware.png');

    // 8. Prayer & Ramadan Subtitle Verification (/admin/prayer)
    console.log('Navigating to /admin/prayer...');
    await page.goto('http://localhost:3000/admin/prayer', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/nav_08_prayer_fixed_subtitle.png`, fullPage: false });
    console.log('Saved nav_08_prayer_fixed_subtitle.png');

  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

capture();
