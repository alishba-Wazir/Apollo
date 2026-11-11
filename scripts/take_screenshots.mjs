import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\2e0ee44a-adfd-4a12-b3ca-3ef1228778aa";

async function run() {
  console.log("Launching local Chrome via puppeteer-core...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. Desktop Dark Mode (1440x900)
  console.log("Capturing Desktop Dark...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/command", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase1_desktop_dark.png") });

  // 2. Desktop Light Mode (1440x900)
  console.log("Capturing Desktop Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase1_desktop_light.png") });

  // 3. Mobile Dark Mode (375x812)
  console.log("Capturing Mobile Dark...");
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase1_mobile_dark.png") });

  // 4. Mobile Light Mode (375x812)
  console.log("Capturing Mobile Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase1_mobile_light.png") });

  await browser.close();
  console.log("All Phase 1 screenshots captured successfully in artifact directory!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
