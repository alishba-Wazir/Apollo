import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\2e0ee44a-adfd-4a12-b3ca-3ef1228778aa";

async function main() {
  console.log("Launching Chromium for visual verification...");
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Dark Mode (1440x900)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/command", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const dest = path.join(ARTIFACT_DIR, "phase1_desktop_dark.png");
    await page.screenshot({ path: dest, fullPage: false });
    console.log("Captured:", dest);
    await context.close();
  }

  // 2. Desktop Light Mode (1440x900)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: "light",
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/command", { waitUntil: "networkidle" });
    // Switch to light mode via button or attribute
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "light");
    });
    await page.waitForTimeout(1000);
    const dest = path.join(ARTIFACT_DIR, "phase1_desktop_light.png");
    await page.screenshot({ path: dest, fullPage: false });
    console.log("Captured:", dest);
    await context.close();
  }

  // 3. Mobile Dark Mode (375x812)
  {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      colorScheme: "dark",
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/command", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const dest = path.join(ARTIFACT_DIR, "phase1_mobile_dark.png");
    await page.screenshot({ path: dest, fullPage: false });
    console.log("Captured:", dest);
    await context.close();
  }

  // 4. Mobile Light Mode (375x812)
  {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      colorScheme: "light",
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/command", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "light");
    });
    await page.waitForTimeout(1000);
    const dest = path.join(ARTIFACT_DIR, "phase1_mobile_light.png");
    await page.screenshot({ path: dest, fullPage: false });
    console.log("Captured:", dest);
    await context.close();
  }

  await browser.close();
  console.log("All Phase 1 screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
