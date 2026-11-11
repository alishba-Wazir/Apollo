import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\2e0ee44a-adfd-4a12-b3ca-3ef1228778aa";

async function run() {
  console.log("Launching local Chrome for Phase 3 visual verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. PRO Copilot Desktop Dark (1440x950)
  console.log("Capturing PRO Copilot Desktop Dark...");
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto("http://localhost:3000/pro", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_pro_copilot_desktop_dark.png") });

  // 2. PRO Copilot Desktop Light (1440x950)
  console.log("Capturing PRO Copilot Desktop Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_pro_copilot_desktop_light.png") });

  // 3. PRO Clients Table Dark (1440x950)
  console.log("Capturing PRO Clients Dark...");
  await page.goto("http://localhost:3000/pro/clients", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_pro_clients_dark.png") });

  // 4. PRO Workout Substitution Dark (1440x1050)
  console.log("Capturing PRO Substitution Dark...");
  await page.setViewport({ width: 1440, height: 1050 });
  await page.goto("http://localhost:3000/pro/substitutions", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_pro_substitutions_dark.png") });

  // 5. MEMBER Today Desktop Dark (1440x950)
  console.log("Capturing MEMBER Today Desktop Dark...");
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto("http://localhost:3000/member", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_member_today_desktop_dark.png") });

  // 6. MEMBER Today Desktop Light (1440x950)
  console.log("Capturing MEMBER Today Desktop Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_member_today_desktop_light.png") });

  // 7. MEMBER Today Mobile Dark (375x812)
  console.log("Capturing MEMBER Today Mobile Dark...");
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_member_today_mobile_dark.png") });

  // 8. MEMBER Milestones & PRs Dark (1440x950)
  console.log("Capturing MEMBER Milestones Dark...");
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto("http://localhost:3000/member/milestones", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_member_milestones_dark.png") });

  // 9. MEMBER Floor Navigator Heatmap Dark (1440x950)
  console.log("Capturing MEMBER Floor Map Dark...");
  await page.goto("http://localhost:3000/member/floor-map", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase3_member_floormap_dark.png") });

  await browser.close();
  console.log("All Phase 3 screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
