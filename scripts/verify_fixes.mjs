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
  await page.setViewport({ width: 1440, height: 950 });

  // 1. APOLLO BRAIN Dark Mode
  await page.goto("http://localhost:3000/command/brain", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outputDir, "apollo_brain_dark.png"),
    fullPage: false,
  });
  console.log("Captured apollo_brain_dark.png");

  // 2. APOLLO BRAIN Light Mode (Verifying high contrast white background and dark text)
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outputDir, "apollo_brain_light.png"),
    fullPage: false,
  });
  console.log("Captured apollo_brain_light.png");

  // 3. Connectors Tab (Send demo message, 0300-0000000, Payment gateway (demo), No card data stored)
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    const btns = Array.from(document.querySelectorAll("button"));
    const connBtn = btns.find((b) => b.textContent && b.textContent.includes("Integration Connectors"));
    if (connBtn) connBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, "apollo_connectors_tab.png"),
    fullPage: false,
  });
  console.log("Captured apollo_connectors_tab.png");

  // 4. Trainer Copilot with Demo Message Draft Open
  await page.goto("http://localhost:3000/pro", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate(() => {
    const draftBtns = Array.from(document.querySelectorAll("button")).filter(
      (b) => b.textContent && b.textContent.toLowerCase().includes("draft message")
    );
    if (draftBtns.length > 0) draftBtns[0].click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, "trainer_copilot_demo.png"),
    fullPage: false,
  });
  console.log("Captured trainer_copilot_demo.png with modal open");

  // 5. COMMAND Overview Light Mode
  await page.goto("http://localhost:3000/command", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outputDir, "command_overview_light.png"),
    fullPage: false,
  });
  console.log("Captured command_overview_light.png");

  // 6. KIOSK Touch Payments Terminal
  await page.goto("http://localhost:3000/kiosk/pay", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outputDir, "kiosk_payments_demo.png"),
    fullPage: false,
  });
  console.log("Captured kiosk_payments_demo.png");

  await browser.close();
  console.log("All verification screenshots completed successfully!");
}

run().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
