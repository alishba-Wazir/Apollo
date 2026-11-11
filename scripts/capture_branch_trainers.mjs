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

  // Open /branch/trainers in Dark Mode
  console.log("Navigating to /branch/trainers (Dark Mode)...");
  await page.goto("http://localhost:3000/branch/trainers", { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("apollo-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(outputDir, "branch_trainers_dark.png"),
    fullPage: false,
  });
  console.log("Captured branch_trainers_dark.png");

  // Toggle to Light Mode
  console.log("Toggling to Light Mode...");
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("apollo-theme", "light");
  });
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(outputDir, "branch_trainers_light.png"),
    fullPage: false,
  });
  console.log("Captured branch_trainers_light.png");

  await browser.close();
  console.log("Trainers screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
