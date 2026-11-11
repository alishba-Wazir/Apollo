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
  await page.setViewport({ width: 1440, height: 1100 });

  // Navigate to login first
  await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded", timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));

  // Set Branch Manager (Seaview) cookie
  console.log("Setting Branch Manager session cookie...");
  const managerSession = {
    id: "usr-mgr-seaview",
    email: "manager.seaview@trifit.com",
    name: "Seaview General Manager",
    role: "BRANCH_MANAGER",
    branchId: "branch-seaview",
    branchName: "TRI FIT Seaview Flagship",
    branchCity: "Karachi",
  };
  await page.setCookie({
    name: "apollo_session",
    value: encodeURIComponent(JSON.stringify(managerSession)),
    domain: "localhost",
    path: "/",
  });

  // Open /branch/classes in Dark Mode
  console.log("Navigating to /branch/classes (Dark Mode)...");
  await page.goto("http://localhost:3000/branch/classes", { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("apollo-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(outputDir, "branch_classes_dark.png"),
    fullPage: false,
  });
  console.log("Captured branch_classes_dark.png");

  // Toggle to Light Mode
  console.log("Toggling to Light Mode...");
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("apollo-theme", "light");
  });
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(outputDir, "branch_classes_light.png"),
    fullPage: false,
  });
  console.log("Captured branch_classes_light.png");

  // 4. Toggle back to dark mode and inspect Prayer Conflict
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("apollo-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 600));

  // Click on the class with prayer buffer conflict (Evening Surge MetCon)
  console.log("Selecting class with prayer conflict...");
  const classCards = await page.$$("button");
  for (const card of classCards) {
    const text = await page.evaluate((el) => el.textContent, card);
    if (text && text.includes("Evening Surge MetCon")) {
      await card.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(outputDir, "branch_classes_prayer_conflict.png"),
    fullPage: false,
  });
  console.log("Captured branch_classes_prayer_conflict.png");

  await browser.close();
  console.log("Classes screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
