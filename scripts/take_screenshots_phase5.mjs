import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\2e0ee44a-adfd-4a12-b3ca-3ef1228778aa";

async function run() {
  console.log("Launching local Chrome for Phase 5 visual verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. Facility Management Desktop Dark (1440x950)
  console.log("Capturing Facility Management Desktop Dark...");
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto("http://localhost:3000/command/facility", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase5_facility_desktop_dark.png") });

  // 2. Facility Management Desktop Light (1440x950)
  console.log("Capturing Facility Management Desktop Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase5_facility_desktop_light.png") });

  // 3. Corporate Wellness Desktop Dark (1440x950)
  console.log("Capturing Corporate Wellness Desktop Dark...");
  await page.goto("http://localhost:3000/command/corporate", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase5_corporate_privacy_dark.png") });

  // 4. Corporate Wellness Desktop Light (1440x950)
  console.log("Capturing Corporate Wellness Desktop Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase5_corporate_privacy_light.png") });

  // 5. Member Journey CRM Desktop Dark (1440x950)
  console.log("Capturing Member Journey CRM Desktop Dark...");
  await page.goto("http://localhost:3000/command/journey", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase5_journey_crm_dark.png") });

  // 6. Member Journey Mobile Dark (375x812)
  console.log("Capturing Member Journey Mobile Dark...");
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/command/journey", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase5_journey_mobile_dark.png") });

  await browser.close();
  console.log("All Phase 5 screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
