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
  await page.setViewport({ width: 1440, height: 1050 });

  // 1. Admin Portal with Network Attendance & Capacity Charts
  console.log("Setting Admin session cookie...");
  const adminSession = {
    id: "usr-admin-01",
    email: "admin@trifit.com",
    name: "TriFit Lead Admin",
    role: "ADMIN",
    branchId: null,
    branchName: "All Branches (Network-Wide)",
    branchCity: "Karachi & Islamabad",
  };
  await page.setCookie({
    name: "apollo_session",
    value: encodeURIComponent(JSON.stringify(adminSession)),
    domain: "localhost",
    path: "/",
  });

  console.log("Navigating to /admin with charts...");
  await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1600)); // allow chart animation to run
  await page.screenshot({
    path: path.join(outputDir, "charts_admin_network.png"),
    fullPage: false,
  });
  console.log("Captured charts_admin_network.png");

  // 2. Branch Manager Today with Hourly Surge Curve
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

  console.log("Navigating to /branch/today with hourly curve...");
  await page.goto("http://localhost:3000/branch/today", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({
    path: path.join(outputDir, "charts_branch_today.png"),
    fullPage: false,
  });
  console.log("Captured charts_branch_today.png");

  // 3. Branch Manager Win-back with Member Habit Drop Chart
  console.log("Navigating to /branch/winback with member habit drop chart...");
  await page.goto("http://localhost:3000/branch/winback", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({
    path: path.join(outputDir, "charts_branch_winback.png"),
    fullPage: false,
  });
  console.log("Captured charts_branch_winback.png");

  await browser.close();
  console.log("All chart screenshots successfully captured!");
}

run().catch((err) => {
  console.error("Chart screenshot error:", err);
  process.exit(1);
});
