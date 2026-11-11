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
  await page.setViewport({ width: 1440, height: 1300 });

  // Navigate to localhost first so cookies can be set on domain
  await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded", timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));

  // 1. Set Branch Manager (Seaview) Session Cookie
  console.log("Setting Branch Manager (Seaview) session cookie...");
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

  // 2. Open /branch/winback in Dark Mode
  console.log("Navigating to /branch/winback (Dark Mode)...");
  await page.goto("http://localhost:3000/branch/winback", {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("apollo-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({
    path: path.join(outputDir, "winback_branch_dark.png"),
    fullPage: false,
  });
  console.log("Captured winback_branch_dark.png");

  // 3. Toggle to Light Mode and capture
  console.log("Toggling to Light Mode...");
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("apollo-theme", "light");
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(outputDir, "winback_branch_light.png"),
    fullPage: false,
  });
  console.log("Captured winback_branch_light.png");

  // 4. Toggle back to dark mode
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("apollo-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 600));

  // 5. Click simulated Injury reply button to display handover banner
  console.log("Clicking simulated Injury reply button...");
  const buttons = await page.$$("button");
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes("Injury")) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({
    path: path.join(outputDir, "winback_interactive_chat_handover.png"),
    fullPage: false,
  });
  console.log("Captured winback_interactive_chat_handover.png");

  await browser.close();
  console.log("Winback screen capture complete!");
}

run().catch((err) => {
  console.error("Error capturing winback:", err);
  process.exit(1);
});
