import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\2e0ee44a-adfd-4a12-b3ca-3ef1228778aa";

async function run() {
  console.log("Launching local Chrome for Phase 2 verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. Overview Desktop Dark
  console.log("Capturing Overview Desktop Dark...");
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto("http://localhost:3000/command", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1600)); // allow count-ups & line chart drawing
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase2_command_desktop_dark.png") });

  // 2. Overview Desktop Light
  console.log("Capturing Overview Desktop Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase2_command_desktop_light.png") });

  // 3. Overview Mobile Dark
  console.log("Capturing Overview Mobile Dark...");
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase2_command_mobile_dark.png") });

  // 4. Overview Mobile Light
  console.log("Capturing Overview Mobile Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase2_command_mobile_light.png") });

  // 5. Revenue Simulator Desktop Dark
  console.log("Capturing Revenue Simulator Dark...");
  await page.setViewport({ width: 1440, height: 1050 });
  await page.goto("http://localhost:3000/command/revenue", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase2_revenue_simulator_dark.png") });

  // 6. Waitlists Desktop Dark
  console.log("Capturing Waitlists Table Dark...");
  await page.goto("http://localhost:3000/command/waitlists", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase2_waitlists_dark.png") });

  // 7. APOLLO BRAIN Feed Desktop Dark
  console.log("Capturing APOLLO BRAIN Feed Dark...");
  await page.goto("http://localhost:3000/command/brain", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase2_brain_dark.png") });

  await browser.close();
  console.log("All Phase 2 screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
