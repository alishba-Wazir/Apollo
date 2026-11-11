import puppeteer from "puppeteer-core";
import path from "path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outputDir = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\2e0ee44a-adfd-4a12-b3ca-3ef1228778aa";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. 3D Digital Twin - Desktop Dark
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto("http://localhost:3000/member/digital-twin", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outputDir, "phase6_digital_twin_dark.png"),
    fullPage: false,
  });
  console.log("Captured phase6_digital_twin_dark.png");

  // 2. 3D Digital Twin - Desktop Light
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, "phase6_digital_twin_light.png"),
    fullPage: false,
  });
  console.log("Captured phase6_digital_twin_light.png");

  // 3. 3D Digital Twin - Mobile Dark
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, "phase6_digital_twin_mobile_dark.png"),
    fullPage: false,
  });
  console.log("Captured phase6_digital_twin_mobile_dark.png");

  // 4. APOLLO BRAIN & Background Jobs - Desktop Dark
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto("http://localhost:3000/command/brain", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 800));

  // Switch to JOBS tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const jobsBtn = btns.find((b) => b.textContent && b.textContent.includes("Background Automation"));
    if (jobsBtn) jobsBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, "phase6_brain_jobs_dark.png"),
    fullPage: false,
  });
  console.log("Captured phase6_brain_jobs_dark.png");

  // 5. Integration Connectors (WhatsApp & Stripe) - Desktop Dark
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const connBtn = btns.find((b) => b.textContent && b.textContent.includes("Integration Connectors"));
    if (connBtn) connBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, "phase6_connectors_dark.png"),
    fullPage: false,
  });
  console.log("Captured phase6_connectors_dark.png");

  // 6. AI Medical Safety Firewall - Desktop Dark
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const fireBtn = btns.find((b) => b.textContent && b.textContent.includes("AI Medical Safety Firewall"));
    if (fireBtn) fireBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  // Trigger evaluation
  await page.evaluate(() => {
    const evalBtn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent && b.textContent.includes("Evaluate Safety Filter"));
    if (evalBtn) evalBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outputDir, "phase6_firewall_dark.png"),
    fullPage: false,
  });
  console.log("Captured phase6_firewall_dark.png");

  await browser.close();
  console.log("All Phase 6 visual verification screenshots captured successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
