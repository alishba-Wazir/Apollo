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
    await new Promise(r => setTimeout(r, 1500));

    // Configure Dark Mode
    console.log('Navigating to /admin (Dashboard)...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('apollo-theme', 'dark');
    });
    // Wait for animations and Leaflet tiles
    await new Promise(r => setTimeout(r, 3000));

    // Capture 1: Top Dashboard Overview (Welcome, What you need to know, 6 KPIs, 3 Charts)
    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_dashboard_overview.png`,
      fullPage: false,
    });
    console.log('Saved admin_dashboard_overview.png');

    // Capture 2: Scrolled View (Leaflet map with pins, At-risk members, Needs attention, Table with Total row, Win-back queue)
    console.log('Scrolling down to map and tables...');
    await page.evaluate(() => {
      window.scrollBy(0, 750);
    });
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_dashboard_map_tables.png`,
      fullPage: false,
    });
    console.log('Saved admin_dashboard_map_tables.png');

    // Capture 3: Scrolled further down to Branches Table with Network Total Row & Win-Back Queue
    console.log('Scrolling to table & winback queue...');
    await page.evaluate(() => {
      window.scrollBy(0, 700);
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_dashboard_table_queue.png`,
      fullPage: false,
    });
    console.log('Saved admin_dashboard_table_queue.png');

    // Capture 4: Filter to a single branch via scope switcher
    console.log('Selecting TRI FIT Seaview in branch switcher...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await new Promise(r => setTimeout(r, 500));
    const branchBtn = await page.$('header .relative button');
    if (branchBtn) {
      await branchBtn.click();
      await new Promise(r => setTimeout(r, 600));
      // Click Seaview button in dropdown
      const seaviewOption = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('header .relative button'));
        const target = buttons.find(b => b.textContent && b.textContent.includes('Seaview'));
        if (target) {
          target.click();
          return true;
        }
        return false;
      });
      console.log('Clicked Seaview scope:', seaviewOption);
      await new Promise(r => setTimeout(r, 2000));

      await page.screenshot({
        path: `${ARTIFACT_DIR}/admin_dashboard_filtered.png`,
        fullPage: false,
      });
      console.log('Saved admin_dashboard_filtered.png');
    }

    // Capture 5: Network Screen with Cards and Modal
    console.log('Navigating to /admin/network (Network Cards Screen)...');
    await page.goto('http://localhost:3000/admin/network', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({
      path: `${ARTIFACT_DIR}/admin_network_cards.png`,
      fullPage: false,
    });
    console.log('Saved admin_network_cards.png');

    // Click "Open Branch View" on first card to demonstrate modal
    const openBtn = await page.$('button.btn-primary');
    if (openBtn) {
      await openBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({
        path: `${ARTIFACT_DIR}/admin_network_branch_modal.png`,
        fullPage: false,
      });
      console.log('Saved admin_network_branch_modal.png');
    }

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

capture();
