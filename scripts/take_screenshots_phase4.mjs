import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\2e0ee44a-adfd-4a12-b3ca-3ef1228778aa";

async function run() {
  console.log("Launching local Chrome for Phase 4 visual verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. KIOSK PIN Pad Desktop Dark (1440x950)
  console.log("Capturing KIOSK PIN Desktop Dark...");
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto("http://localhost:3000/kiosk", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase4_kiosk_pin_desktop_dark.png") });

  // 2. KIOSK PIN Pad Desktop Light (1440x950)
  console.log("Capturing KIOSK PIN Desktop Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase4_kiosk_pin_desktop_light.png") });

  // 3. KIOSK Guest Pass Registration Dark (1440x950)
  console.log("Capturing KIOSK Guest Pass Dark...");
  await page.goto("http://localhost:3000/kiosk/guest", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase4_kiosk_guest_pass_dark.png") });

  // 4. KIOSK Class Booking Dark (1440x950)
  console.log("Capturing KIOSK Class Booking Dark...");
  await page.goto("http://localhost:3000/kiosk/booking", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase4_kiosk_booking_dark.png") });

  // 5. KIOSK Demo Payments Terminal Dark (1440x950)
  console.log("Capturing KIOSK Demo Payments Dark...");
  await page.goto("http://localhost:3000/kiosk/pay", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase4_kiosk_pay_choose_dark.png") });

  // 6. KIOSK Smart Access Management Dark (1440x950)
  console.log("Capturing Smart Access Management Dark...");
  await page.goto("http://localhost:3000/kiosk/access", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase4_kiosk_smart_access_dark.png") });

  // 7. KIOSK Mobile Dark (375x812)
  console.log("Capturing KIOSK Mobile Dark...");
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/kiosk", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase4_kiosk_mobile_dark.png") });

  // 8. KIOSK Mobile Light (375x812)
  console.log("Capturing KIOSK Mobile Light...");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "phase4_kiosk_mobile_light.png") });

  await browser.close();
  console.log("All Phase 4 screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
